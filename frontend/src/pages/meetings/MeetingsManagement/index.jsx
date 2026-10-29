import React from 'react';
import { CalendarPlus, CalendarX } from 'lucide-react';
import { CardSkeleton } from '../../../components/common/Skeleton';
import { EmptyState } from '../../../components/common/EmptyState';
import { Pagination } from '../../../components/common/Pagination';
import { Modal } from '../../../components/common/Modal';
import { Button, PageHeader } from '../../../components/ui';
import ScheduleMeetingModal from '../../../components/meetings/ScheduleMeetingModal';
import InAppVideoRoom from '../../../components/meetings/InAppVideoRoom';
import MeetingNotesEditor from '../../../components/meetings/MeetingNotesEditor';
import { useMeetingsPage } from './useMeetingsPage';
import { MeetingFilters } from './MeetingFilters';
import { MeetingCard } from './MeetingCard';

export const MeetingsManagement = () => {
  const view = useMeetingsPage();
  const {
    meetings,
    pagination,
    isLoading,
    page,
    setPage,
    canSchedule,
    isScheduleOpen,
    setIsScheduleOpen,
    activeVideoMeeting,
    setActiveVideoMeeting,
    activeNotesMeeting,
    setActiveNotesMeeting,
    handleJoinMeeting,
    joiningId,
    handleCloseMeeting,
  } = view;

  const scheduleButton = canSchedule && (
    <Button variant="primary" icon={CalendarPlus} onClick={() => setIsScheduleOpen(true)}>
      Schedule meeting
    </Button>
  );

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="Meetings"
        description="Schedule client and team meetings, join video calls, and turn the minutes into tasks."
        actions={scheduleButton}
      />

      <MeetingFilters {...view} />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : meetings.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface">
          <EmptyState
            icon={CalendarX}
            title="No meetings found"
            description={canSchedule ? 'Try a different search or filter, or schedule a new meeting.' : 'There are no scheduled meetings at this time.'}
            action={scheduleButton || undefined}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {meetings.map((meeting) => (
            <MeetingCard
              key={meeting.id}
              meeting={meeting}
              canSchedule={canSchedule}
              onJoin={handleJoinMeeting}
              joining={joiningId === meeting.id}
              onNotes={setActiveNotesMeeting}
              onClose={handleCloseMeeting}
            />
          ))}
        </div>
      )}

      {pagination?.totalPages > 1 && (
        <div className="rounded-2xl border border-line bg-surface overflow-hidden">
          <Pagination
            currentPage={page}
            totalPages={pagination.totalPages}
            totalRecords={pagination.totalRecords}
            limit={12}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* Minutes of meeting, in a dialog so it opens where you are rather than at the top of the page */}
      <Modal
        isOpen={Boolean(activeNotesMeeting)}
        onClose={() => setActiveNotesMeeting(null)}
        title={activeNotesMeeting ? `Notes: ${activeNotesMeeting.title}` : 'Notes'}
        maxWidth="max-w-2xl"
      >
        {activeNotesMeeting && <MeetingNotesEditor key={activeNotesMeeting.id} meeting={activeNotesMeeting} onRefresh={() => {}} />}
      </Modal>

      <ScheduleMeetingModal isOpen={isScheduleOpen} onClose={() => setIsScheduleOpen(false)} />

      {activeVideoMeeting && <InAppVideoRoom meeting={activeVideoMeeting} onClose={() => setActiveVideoMeeting(null)} />}
    </div>
  );
};

export default MeetingsManagement;
