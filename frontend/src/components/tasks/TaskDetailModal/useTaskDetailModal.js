import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  useTaskDetail,
  useAddSubtask,
  useToggleSubtask,
  useAddComment,
  useAddDocument,
  useUpdateTaskStatus,
} from '../../../queries/useTasks';

export const useTaskDetailModal = ({ taskId, isOpen, onRefresh }) => {
  const [activeTab, setActiveTab] = useState('subtasks'); // 'subtasks' | 'comments' | 'documents' | 'history'

  // Subtask Input
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  // Comment Input
  const [commentText, setCommentText] = useState('');
  const [commentFileUrl, setCommentFileUrl] = useState('');

  // Document Attachment Input
  const [docName, setDocName] = useState('');
  const [docUrl, setDocUrl] = useState('');

  const { task, isLoading, error } = useTaskDetail(taskId, { enabled: isOpen });

  const updateStatusMutation = useUpdateTaskStatus();
  const addSubtaskMutation = useAddSubtask();
  const toggleSubtaskMutation = useToggleSubtask();
  const addCommentMutation = useAddComment();
  const addDocumentMutation = useAddDocument();

  useEffect(() => {
    if (error) {
      toast.error('Failed to load task details');
    }
  }, [error]);

  const handleStatusChange = (newStatus) => {
    updateStatusMutation.mutate(
      { taskId, status: newStatus },
      {
        onSuccess: () => {
          if (onRefresh) onRefresh();
        },
      }
    );
  };

  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    addSubtaskMutation.mutate(
      { taskId, title: newSubtaskTitle },
      {
        onSuccess: () => {
          setNewSubtaskTitle('');
          if (onRefresh) onRefresh();
        },
      }
    );
  };

  const handleToggleSubtask = (subtaskId, currentStatus) => {
    toggleSubtaskMutation.mutate(
      { taskId, subtaskId, isCompleted: !currentStatus },
      {
        onSuccess: () => {
          if (onRefresh) onRefresh();
        },
      }
    );
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addCommentMutation.mutate(
      { taskId, commentData: { comment: commentText, fileUrl: commentFileUrl } },
      {
        onSuccess: () => {
          setCommentText('');
          setCommentFileUrl('');
        },
      }
    );
  };

  const handleAddDocument = (e) => {
    e.preventDefault();
    if (!docName.trim() || !docUrl.trim()) {
      toast.error('File name and URL are required');
      return;
    }
    addDocumentMutation.mutate(
      { taskId, docData: { fileName: docName, fileUrl: docUrl } },
      {
        onSuccess: () => {
          setDocName('');
          setDocUrl('');
        },
      }
    );
  };

  // Subtask Progress Calculation
  const totalSubtasks = task?.subtasks?.length || 0;
  const completedSubtasks = task?.subtasks?.filter((s) => s.isCompleted)?.length || 0;
  const progressPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  return {
    activeTab,
    setActiveTab,
    newSubtaskTitle,
    setNewSubtaskTitle,
    commentText,
    setCommentText,
    commentFileUrl,
    setCommentFileUrl,
    docName,
    setDocName,
    docUrl,
    setDocUrl,
    task,
    isLoading,
    handleStatusChange,
    handleAddSubtask,
    handleToggleSubtask,
    handleAddComment,
    handleAddDocument,
    taskId,
    totalSubtasks,
    completedSubtasks,
    progressPercent,
  };
};
