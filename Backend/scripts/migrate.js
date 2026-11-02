/**
 * Applies database migrations on startup (npm start runs this before the server).
 *
 * The production database was first built with `prisma db push`, so it has every table but no
 * migration history, and `prisma migrate deploy` refuses it with P3005. When that happens and the
 * database already contains what the two baseline migrations create, this marks those two as
 * applied and runs `migrate deploy` again, which then applies only the newer migrations. In any
 * other situation it stops with a clear message rather than guessing.
 */
const { spawnSync } = require('child_process');
const path = require('path');

const PRISMA = path.join(__dirname, '..', 'node_modules', 'prisma', 'build', 'index.js');
const BASELINE = ['20260727075406_', '20260801000000_catch_up_with_schema'];

const prisma = (args) => {
  const res = spawnSync(process.execPath, [PRISMA, ...args], { encoding: 'utf8' });
  const output = `${res.stdout || ''}${res.stderr || ''}`;
  return { ok: res.status === 0, output };
};

/** True when the tables and columns added by the two baseline migrations are already there. */
const hasBaselineSchema = async () => {
  const { PrismaClient } = require('@prisma/client');
  const client = new PrismaClient();
  try {
    const rows = await client.$queryRaw`
      SELECT
        (SELECT COUNT(*) FROM information_schema.tables
          WHERE table_schema = current_schema() AND table_name IN ('users', 'firms', 'invoices', 'meetings', 'meeting_notes')) AS tables,
        (SELECT COUNT(*) FROM information_schema.columns
          WHERE table_schema = current_schema() AND table_name = 'firms' AND column_name IN ('upiId', 'geofenceEnabled')) AS columns,
        (SELECT COUNT(*) FROM information_schema.tables
          WHERE table_schema = current_schema() AND table_name = '_prisma_migrations') AS history
    `;
    const { tables, columns, history } = rows[0];
    return Number(tables) === 5 && Number(columns) === 2 && Number(history) === 0;
  } finally {
    await client.$disconnect();
  }
};

const main = async () => {
  const first = prisma(['migrate', 'deploy']);
  process.stdout.write(first.output);
  if (first.ok) return;

  if (!first.output.includes('P3005')) {
    console.error('\n[migrate] migrate deploy failed (see above). Not starting the server.');
    process.exit(1);
  }

  console.log('\n[migrate] Database has tables but no migration history (built with db push).');
  if (!(await hasBaselineSchema())) {
    console.error(
      '[migrate] It does not look like the baseline schema, so nothing was changed automatically.\n' +
        '[migrate] Follow Backend/prisma/MIGRATIONS.md to baseline it by hand.'
    );
    process.exit(1);
  }

  for (const name of BASELINE) {
    console.log(`[migrate] Marking ${name} as already applied`);
    const res = prisma(['migrate', 'resolve', '--applied', name]);
    process.stdout.write(res.output);
    if (!res.ok) {
      console.error(`[migrate] Could not mark ${name} as applied. Not starting the server.`);
      process.exit(1);
    }
  }

  const second = prisma(['migrate', 'deploy']);
  process.stdout.write(second.output);
  if (!second.ok) {
    console.error('[migrate] migrate deploy failed after baselining. Not starting the server.');
    process.exit(1);
  }
};

main().catch((error) => {
  console.error('[migrate] Unexpected error:', error.message);
  process.exit(1);
});
