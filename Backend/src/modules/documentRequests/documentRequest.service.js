const prisma = require('../../config/db');
const emailService = require('../../services/emailService');
const notificationService = require('../notifications/notification.service');
const { BadRequestError, NotFoundError } = require('../../utils/errors');

const REMIND_GAP_MS = 10 * 60 * 1000;
const clientSelect = { select: { id: true, clientName: true, companyName: true, email: true } };
const clientName = (c) => c?.companyName || c?.clientName || 'Client';
const escapeHtml = (s = '') => String(s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);

/** Documents a firm asks its clients for, tracked until they arrive. */
class DocumentRequestService {
  async list(user, { status = 'PENDING' } = {}) {
    const where = user.isClient
      ? { clientId: user.id, status: 'PENDING' }
      : { firmId: user.firmId, ...(status === 'ALL' ? {} : { status }) };
    return prisma.documentRequest.findMany({
      where,
      orderBy: [{ dueDate: { sort: 'asc', nulls: 'last' } }, { createdAt: 'desc' }],
      take: 200,
      include: { client: clientSelect },
    });
  }

  async create(data, user) {
    const clientId = parseInt(data.clientId, 10);
    const client = await prisma.client.findFirst({ where: { id: clientId, firmId: user.firmId, deletedAt: null }, select: { id: true } });
    if (!client) throw new NotFoundError('Client not found');

    const request = await prisma.documentRequest.create({
      data: {
        firmId: user.firmId,
        clientId,
        title: data.title.trim(),
        notes: data.notes?.trim() || null,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        requestedBy: user.id,
      },
      include: { client: clientSelect },
    });
    this.#tellClient(request, 'DOCUMENT_REQUESTED', `Your CA firm needs: ${request.title}`);
    return request;
  }

  async update(id, { status }, user) {
    const request = await this.#find(id, user.firmId);
    if (request.status !== 'PENDING') throw new BadRequestError(`This request is already ${request.status.toLowerCase()}.`);
    return prisma.documentRequest.update({
      where: { id },
      data: { status, receivedAt: status === 'RECEIVED' ? new Date() : null },
      include: { client: clientSelect },
    });
  }

  async remind(id, user) {
    const request = await this.#find(id, user.firmId);
    if (request.status !== 'PENDING') throw new BadRequestError('Only pending requests can be reminded.');
    if (request.lastRemindedAt && Date.now() - request.lastRemindedAt.getTime() < REMIND_GAP_MS) {
      throw new BadRequestError('A reminder was just sent. Try again in a few minutes.');
    }
    const updated = await prisma.documentRequest.update({ where: { id }, data: { lastRemindedAt: new Date() }, include: { client: clientSelect } });
    this.#tellClient(updated, 'DOCUMENT_REMINDER', `Reminder: please upload ${updated.title}`);
    return updated;
  }

  async #find(id, firmId) {
    const request = await prisma.documentRequest.findFirst({ where: { id, firmId }, include: { client: clientSelect } });
    if (!request) throw new NotFoundError('Document request not found');
    return request;
  }

  /** In-app notification plus an email to the client; neither can fail the request itself. */
  #tellClient(request, type, title) {
    const due = request.dueDate ? ` by ${request.dueDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}` : '';
    notificationService.later(() => [
      { firmId: request.firmId, clientId: request.clientId, type, title, body: `${request.notes || 'Upload it from your Documents page'}${due}.`, link: '/client/document-vault' },
    ]);
    const to = request.client?.email;
    if (!to) return;
    Promise.resolve()
      .then(() =>
        emailService.sendEmail({
        to,
        subject: title,
        html: `<p>Dear ${escapeHtml(clientName(request.client))},</p><p>Please upload <strong>${escapeHtml(request.title)}</strong>${escapeHtml(due)} from the Documents page of your client portal.</p>${
          request.notes ? `<p>${escapeHtml(request.notes)}</p>` : ''
        }`,
        })
      )
      .catch((err) => console.log('Document request email skipped:', err.message));
  }
}

module.exports = new DocumentRequestService();
