import React from 'react';
import { Mail, UserPlus } from 'lucide-react';
import { Modal } from '../../common/Modal';
import { Avatar } from '../../common/Avatar';
import { Badge, Button, SearchInput } from '../../ui';

export const InviteDrawer = ({
  setIsInviteOpen,
  inviteSearch,
  setInviteSearch,
  loadingInvitees,
  availableUsers,
  availableClients,
  handleSendLiveInvite,
}) => {
  const query = inviteSearch.trim().toLowerCase();
  const people = [...availableUsers, ...availableClients];
  const matches = people.filter(
    (p) => !query || p.name.toLowerCase().includes(query) || p.email.toLowerCase().includes(query)
  );
  // Offer an email invite when the search looks like an address nobody in the directory has.
  const canInviteEmail = query.includes('@') && !people.some((p) => p.email.toLowerCase() === query);

  return (
    <Modal isOpen onClose={() => setIsInviteOpen(false)} title="Invite to this call" maxWidth="max-w-lg">
      <div className="space-y-3">
        <SearchInput
          value={inviteSearch}
          onChange={setInviteSearch}
          placeholder="Search people or type an email"
          className="sm:max-w-none"
        />

        {loadingInvitees ? (
          <p className="text-center py-6 text-sm text-muted" role="status">
            Loading people…
          </p>
        ) : (
          <ul className="space-y-2">
            {canInviteEmail && (
              <li className="p-3 rounded-xl bg-accent-soft border border-accent/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="grid place-items-center w-9 h-9 rounded-full bg-surface text-accent-fg shrink-0">
                    <Mail className="w-4 h-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-fg truncate">{inviteSearch.trim()}</p>
                    <p className="text-xs text-muted">Invite by email</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="primary"
                  icon={UserPlus}
                  onClick={() => handleSendLiveInvite({ name: inviteSearch.trim(), email: inviteSearch.trim(), type: 'EMAIL' })}
                >
                  Invite
                </Button>
              </li>
            )}

            {matches.map((person) => (
              <li
                key={`${person.type}-${person.id}`}
                className="p-3 rounded-xl border border-line flex items-center justify-between gap-3 hover:bg-hover transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar firstName={person.name.split(" ")[0]} lastName={person.name.split(" ").slice(1).join(" ")} size="sm" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-fg truncate">{person.name}</p>
                    <p className="text-xs text-muted truncate">{person.email}</p>
                  </div>
                  {person.role && <Badge tone="neutral" className="hidden sm:inline-flex">{person.role}</Badge>}
                </div>
                <Button size="sm" variant="soft" icon={UserPlus} onClick={() => handleSendLiveInvite(person)} aria-label={`Invite ${person.name}`}>
                  Invite
                </Button>
              </li>
            ))}

            {!canInviteEmail && matches.length === 0 && (
              <li className="text-center py-6 text-sm text-muted">No one matches. Type a full email address to invite someone new.</li>
            )}
          </ul>
        )}
      </div>
    </Modal>
  );
};
