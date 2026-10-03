import React, { useState, useEffect } from 'react';
import { 
  Activity as ActivityIcon, 
  CheckCircle, 
  UserPlus, 
  UserMinus, 
  Edit, 
  FileText, 
  Link, 
  BookOpen, 
  Target, 
  Bookmark,
  Clock,
  Loader2
} from 'lucide-react';
import { getProjectActivities } from '../../api/activityService';
import Button from '../Button';

const getActivityIcon = (type) => {
  switch (type) {
    case 'PROJECT_CREATED':
    case 'PROJECT_UPDATED':
      return <Edit className="w-5 h-5 text-blue-500" />;
    case 'MEMBER_INVITED':
    case 'MEMBER_JOINED':
      return <UserPlus className="w-5 h-5 text-green-500" />;
    case 'MEMBER_REMOVED':
    case 'MEMBER_ROLE_CHANGED':
      return <UserMinus className="w-5 h-5 text-orange-500" />;
    case 'TASK_CREATED':
    case 'TASK_ASSIGNED':
    case 'TASK_REASSIGNED':
      return <ActivityIcon className="w-5 h-5 text-indigo-500" />;
    case 'TASK_COMPLETED':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'DOCUMENT_UPLOADED':
    case 'DOCUMENT_DELETED':
      return <FileText className="w-5 h-5 text-purple-500" />;
    case 'RESOURCE_ADDED':
    case 'RESOURCE_DELETED':
      return <Link className="w-5 h-5 text-blue-500" />;
    case 'RESEARCH_PAPER_ADDED':
    case 'RESEARCH_PAPER_DELETED':
      return <BookOpen className="w-5 h-5 text-amber-500" />;
    case 'REFERENCE_ADDED':
      return <Bookmark className="w-5 h-5 text-emerald-500" />;
    case 'MILESTONE_CREATED':
    case 'MILESTONE_COMPLETED':
      return <Target className="w-5 h-5 text-rose-500" />;
    default:
      return <ActivityIcon className="w-5 h-5 text-slate-400" />;
  }
};

const formatActivityTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

const formatActivityDateGroup = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
};

const ActivityTab = ({ projectId }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchActivities = async (currentPage = 1, append = false) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProjectActivities(projectId, currentPage, 20);
      
      if (append) {
        setActivities(prev => [...prev, ...data.activities]);
      } else {
        setActivities(data.activities);
      }
      
      setHasMore(data.pagination.page < data.pagination.totalPages);
    } catch (err) {
      console.error('Failed to load activities', err);
      setError('Unable to load activity');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities(1, false);
    setPage(1);
  }, [projectId]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchActivities(nextPage, true);
  };

  if (loading && activities.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (error && activities.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
        <ActivityIcon className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">{error}</h3>
        <Button onClick={() => fetchActivities(1, false)} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <ActivityIcon className="w-8 h-8 text-slate-400 dark:text-slate-500" />
        </div>
        <h3 className="text-xl font-medium text-slate-900 dark:text-white mb-2">No activity yet</h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Important project actions will appear here.
        </p>
      </div>
    );
  }

  // Group activities by date
  const groupedActivities = activities.reduce((groups, activity) => {
    const dateGroup = formatActivityDateGroup(activity.createdAt);
    if (!groups[dateGroup]) {
      groups[dateGroup] = [];
    }
    groups[dateGroup].push(activity);
    return groups;
  }, {});

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <ActivityIcon className="w-5 h-5 text-primary-500" />
          Activity
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Track important activity and changes in this research project.
        </p>
      </div>
      
      <div className="p-6">
        <div className="space-y-8">
          {Object.entries(groupedActivities).map(([dateGroup, groupActivities]) => (
            <div key={dateGroup}>
              <div className="flex items-center gap-4 mb-4">
                <h3 className="text-sm font-medium text-slate-900 dark:text-white whitespace-nowrap">
                  {dateGroup}
                </h3>
                <div className="h-px bg-slate-200 dark:bg-slate-800 flex-grow"></div>
              </div>
              
              <div className="space-y-6">
                {groupActivities.map((activity, index) => (
                  <div key={activity._id || index} className="flex gap-4 relative">
                    {/* Timeline line connecting items */}
                    {index !== groupActivities.length - 1 && (
                      <div className="absolute top-10 left-5 bottom-[-24px] w-px bg-slate-200 dark:bg-slate-700"></div>
                    )}
                    
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center relative z-10">
                        {getActivityIcon(activity.type)}
                      </div>
                    </div>
                    
                    <div className="flex-grow pt-1">
                      <p className="text-slate-900 dark:text-slate-200">
                        <span className="font-semibold">{activity.actor?.name || 'Unknown User'}</span>
                        {' '}{activity.message}
                      </p>
                      <div className="flex items-center gap-1 mt-1 text-xs text-slate-500 dark:text-slate-400">
                        <Clock className="w-3 h-3" />
                        {formatActivityTime(activity.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {hasMore && (
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
            <Button
              variant="outline"
              onClick={handleLoadMore}
              disabled={loading}
              className="min-w-[120px]"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Load More'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityTab;
