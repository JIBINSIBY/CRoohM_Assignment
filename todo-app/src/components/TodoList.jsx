import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TodoList = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Research content ideas', completed: false },
    { id: 2, text: 'Create a database of guest authors', completed: false },
    { id: 3, text: "Renew driver's license", completed: false, date: '22-03-22', subtasks: 1, list: 'Personal' },
    { id: 4, text: 'Consult accountant', completed: false, list: 'List 1', subtasks: 3 },
    { id: 5, text: 'Print business card', completed: false }
  ]);
  const [lists, setLists] = useState([
    { id: 1, name: 'Personal', color: '#FF6B6B', taskCount: 3 },
    { id: 2, name: 'Work', color: '#6B7AFF', taskCount: 6 },
    { id: 3, name: 'List 1', color: '#FFD43B', taskCount: 3 }
  ]);
  const [tags, setTags] = useState([
    { id: 1, name: 'Tag 1', color: '#60A5FA' },
    { id: 2, name: 'Tag 2', color: '#F472B6' }
  ]);
  const [showNewTagForm, setShowNewTagForm] = useState(false);
  const [showTaskTagForm, setShowTaskTagForm] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [selectedTagColor, setSelectedTagColor] = useState('#60A5FA');
  const [newTask, setNewTask] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedList, setSelectedList] = useState('Today');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewListForm, setShowNewListForm] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#6B7AFF');
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [newTaskColor, setNewTaskColor] = useState('#FEF9C3'); // Default yellow color
  const [calendarView, setCalendarView] = useState('day');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    startMeridiem: 'AM',
    endTime: '',
    endMeridiem: 'AM'
  });
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0, listId: null });
  const [tagContextMenu, setTagContextMenu] = useState({ show: false, x: 0, y: 0, tagId: null });
  const [showNotifications, setShowNotifications] = useState(false);
  const [taskFilter, setTaskFilter] = useState('all'); // Add this line

  const listColors = [
    '#FF6B6B', // Red
    '#DA77F2', // Purple
    '#6B7AFF', // Blue
    '#4DABF7', // Light Blue
    '#38D9A9', // Turquoise
    '#69DB7C', // Green
    '#FFD43B', // Yellow
    '#FFA94D', // Orange
  ];

  const noteColors = [
    '#FEF9C3', // Light Yellow
    '#DCFCE7', // Light Green
    '#FFE4E6', // Light Pink
    '#E0F2FE', // Light Blue
    '#F3E8FF', // Light Purple
    '#FFE5D0', // Light Orange
  ];

  // Change weekDays array to start with Monday
  const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  const formatDate = (date) => {
    if (calendarView === 'month') {
      return date.toLocaleDateString('en-GB', { 
        month: 'long',
        year: 'numeric'
      });
    }
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDateRange = () => {
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 6);

    const startDay = today.getDate();
    const endDay = endDate.getDate();
    const month = endDate.toLocaleString('default', { month: 'long' });
    const year = endDate.getFullYear();

    return `${startDay}-${endDay} ${month} ${year}`;
  };

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('currentUser');
    if (!user) {
      navigate('/signin');
      return;
    }
    setCurrentUser(JSON.parse(user));

    // Load tasks from localStorage
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }

    // Load lists from localStorage
    const savedLists = localStorage.getItem('lists');
    if (savedLists) {
      setLists(JSON.parse(savedLists));
    }

    // Load tags from localStorage
    const savedTags = localStorage.getItem('tags');
    if (savedTags) {
      setTags(JSON.parse(savedTags));
    }
  }, [navigate]);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;

    const task = {
      id: Date.now(),
      text: newTaskName,
      description: newTaskDescription,
      completed: false,
      list: selectedList === 'Today' ? '' : selectedList,
      date: selectedList === 'Today' ? new Date().toISOString().split('T')[0] : null
    };

    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    
    // Reset form
    setNewTaskName('');
    setNewTaskDescription('');
    setShowNewTaskForm(false);
  };

  const handleSignOut = () => {
    localStorage.removeItem('currentUser');
    navigate('/signin');
  };

  const handleAddList = (e) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    const newList = {
      id: Date.now(),
      name: newListName.trim(),
      color: selectedColor,
      taskCount: 0
    };

    const updatedLists = [...lists, newList];
    setLists(updatedLists);
    localStorage.setItem('lists', JSON.stringify(updatedLists));
    
    setShowNewListForm(false);
    setNewListName('');
    setSelectedColor('#6B7AFF'); // Reset to default color
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    const newTag = {
      id: Date.now(),
      name: newTagName.trim(),
      color: selectedTagColor
    };

    const updatedTags = [...tags, newTag];
    setTags(updatedTags);
    localStorage.setItem('tags', JSON.stringify(updatedTags));
    
    setShowNewTagForm(false);
    setShowTaskTagForm(false);
    setNewTagName('');
    setSelectedTagColor('#60A5FA');
  };

  const getTodaysTasks = () => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(task => task.date === today);
  };

  const getTomorrowsTasks = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    return tasks.filter(task => task.date === tomorrowStr);
  };

  const getThisWeeksTasks = () => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    return tasks.filter(task => {
      if (!task.date) return false;
      const taskDate = new Date(task.date);
      return taskDate > today && taskDate <= nextWeek;
    });
  };

  const handleContextMenu = (e, listId) => {
    e.preventDefault();
    setContextMenu({
      show: true,
      x: e.pageX,
      y: e.pageY,
      listId
    });
  };

  const handleDeleteList = (listId) => {
    const updatedLists = lists.filter(list => list.id !== listId);
    setLists(updatedLists);
    localStorage.setItem('lists', JSON.stringify(updatedLists));
    
    // Remove tasks associated with the deleted list
    const updatedTasks = tasks.filter(task => task.list !== lists.find(l => l.id === listId)?.name);
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    
    setContextMenu({ show: false, x: 0, y: 0, listId: null });
  };

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClick = () => setContextMenu({ show: false, x: 0, y: 0, listId: null });
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const handleTagContextMenu = (e, tagId) => {
    e.preventDefault();
    setTagContextMenu({
      show: true,
      x: e.pageX,
      y: e.pageY,
      tagId
    });
  };

  const handleDeleteTag = (tagId) => {
    // Remove the tag
    const updatedTags = tags.filter(tag => tag.id !== tagId);
    setTags(updatedTags);
    localStorage.setItem('tags', JSON.stringify(updatedTags));
    
    // Remove tag from all tasks that have it
    const updatedTasks = tasks.map(task => ({
      ...task,
      tags: task.tags ? task.tags.filter(id => id !== tagId) : []
    }));
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    
    setTagContextMenu({ show: false, x: 0, y: 0, tagId: null });
  };

  // Close tag context menu when clicking outside
  useEffect(() => {
    const handleClick = () => setTagContextMenu({ show: false, x: 0, y: 0, tagId: null });
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Add this function to check upcoming deadlines
  const getUpcomingDeadlines = () => {
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
    
    return tasks.filter(task => {
      if (!task.date || !task.time || task.completed) return false;
      
      const taskDateTime = new Date(task.date + 'T' + task.time);
      if (task.meridiem === 'PM' && taskDateTime.getHours() !== 12) {
        taskDateTime.setHours(taskDateTime.getHours() + 12);
      } else if (task.meridiem === 'AM' && taskDateTime.getHours() === 12) {
        taskDateTime.setHours(0);
      }
      
      return taskDateTime > now && taskDateTime <= oneHourFromNow;
    });
  };

  // Add useEffect to check notifications every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const upcomingTasks = getUpcomingDeadlines();
      if (upcomingTasks.length > 0) {
        setShowNotifications(true);
        // Request permission and send system notification for each upcoming task
        requestNotificationPermission().then(granted => {
          if (granted) {
            upcomingTasks.forEach(task => {
              sendSystemNotification(task);
            });
          }
        });
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [tasks]);

  // Add initial notification permission request when component mounts
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  // Add this function to request notification permission
  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  };

  // Add this function to send system notification
  const sendSystemNotification = (task) => {
    if (!("Notification" in window)) {
      console.log("This browser does not support system notifications");
      return;
    }

    if (Notification.permission === "granted") {
      const notification = new Notification("Task Due Soon!", {
        body: `${task.text} is due at ${task.time} ${task.meridiem}`,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        tag: `task-${task.id}`,
        requireInteraction: true
      });

      notification.onclick = () => {
        window.focus();
        handleTaskClick(task);
      };
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 w-80 bg-[#F8F8F8] flex flex-col h-screen transition-transform duration-300 ease-in-out z-50 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Menu Header - Fixed */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold">Menu</h1>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 hover:bg-gray-100 rounded-lg relative"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {getUpcomingDeadlines().length > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                      {getUpcomingDeadlines().length}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && getUpcomingDeadlines().length > 0 && (
                  <div className="fixed top-16 right-4 w-80 bg-white rounded-lg shadow-lg border z-[100]">
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-gray-500 mb-3">Upcoming Deadlines</h3>
                      <div className="space-y-3 max-h-[400px] overflow-y-auto">
                        {getUpcomingDeadlines().map(task => (
                          <div 
                            key={task.id}
                            className="flex items-start p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                            onClick={() => {
                              handleTaskClick(task);
                              setShowNotifications(false);
                            }}
                          >
                            <div className="w-2 h-2 mt-2 rounded-full bg-red-500 mr-3"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{task.text}</p>
                              <p className="text-xs text-gray-500">
                                Due on {new Date(task.date).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric',
                                  year: 'numeric'
                                })} at {task.time} {task.meridiem}
                              </p>
                              <p className="text-xs text-red-500 mt-1">
                                Due in less than 1 hour
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <button 
                onClick={() => setSidebarOpen(!isSidebarOpen)} 
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-gray-400 bg-white"
            />
            <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Scrollable Menu Items */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
          <style jsx>{`
            .scrollbar-thin::-webkit-scrollbar {
              width: 6px;
            }
            
            .scrollbar-thin::-webkit-scrollbar-track {
              background: #f1f1f1;
              border-radius: 3px;
            }
            
            .scrollbar-thin::-webkit-scrollbar-thumb {
              background: #d1d5db;
              border-radius: 3px;
              transition: all 0.2s ease;
            }
            
            .scrollbar-thin::-webkit-scrollbar-thumb:hover {
              background: #9ca3af;
            }
          `}</style>
          <div className="px-4">
            {/* Tasks Section */}
            <div className="mb-8">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">TASKS</h2>
              <div className="space-y-1">
                <button 
                  className={`flex items-center w-full p-2 rounded-lg ${selectedList === 'Upcoming' ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
                  onClick={() => setSelectedList('Upcoming')}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Upcoming</span>
                  <span className="ml-auto bg-[#F1F1F1] text-[#424242] text-xs px-[10px] py-[2px] rounded-sm min-w-[22px] text-center">
                    {tasks.filter(task => !task.completed && (
                      (task.date === new Date().toISOString().split('T')[0]) || // Today's tasks
                      (task.date === new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]) || // Tomorrow's tasks
                      (task.date && new Date(task.date) > new Date() && new Date(task.date) <= new Date(new Date().setDate(new Date().getDate() + 7))) // This week's tasks
                    )).length}
                  </span>
                </button>
                <button 
                  className={`flex items-center w-full p-2 rounded-lg ${selectedList === 'Today' ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
                  onClick={() => setSelectedList('Today')}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  <span>Today</span>
                  <span className="ml-auto bg-[#F1F1F1] text-[#424242] text-xs px-[10px] py-[2px] rounded-sm min-w-[22px] text-center">
                    {tasks.filter(task => !task.completed && task.date === new Date().toISOString().split('T')[0]).length}
                  </span>
                </button>
                <button 
                  className={`flex items-center w-full p-2 rounded-lg ${selectedList === 'Calendar' ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
                  onClick={() => setSelectedList('Calendar')}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Calendar</span>
                </button>
                <button 
                  className={`flex items-center w-full p-2 rounded-lg ${selectedList === 'Sticky Wall' ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
                  onClick={() => setSelectedList('Sticky Wall')}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>Sticky Wall</span>
                </button>
              </div>
            </div>

            {/* Lists Section */}
            <div className="mb-8">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">LISTS</h2>
              <div className="space-y-1">
                {lists.map((list) => {
                  const taskCount = tasks.filter(task => !task.completed && task.list === list.name).length;
                  return (
                    <button 
                      key={list.id}
                      className={`flex items-center w-full p-2 rounded-lg hover:bg-gray-100 ${selectedList === list.name ? 'bg-gray-100' : ''}`}
                      onClick={() => setSelectedList(list.name)}
                      onContextMenu={(e) => handleContextMenu(e, list.id)}
                    >
                      <span 
                        className="w-3 h-3 rounded-sm mr-3" 
                        style={{ backgroundColor: list.color }}
                      ></span>
                      <span>{list.name}</span>
                      <span className="ml-auto bg-[#F1F1F1] text-[#424242] text-xs px-[10px] py-[2px] rounded-sm min-w-[22px] text-center">
                        {taskCount}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="relative">
                <button 
                  onClick={() => setShowNewListForm(true)}
                  className="flex items-center w-full p-2 text-gray-500 hover:bg-gray-100 rounded-lg mt-2"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add New List</span>
                </button>

                {/* New List Form Popup */}
                {showNewListForm && (
                  <div className="absolute left-0 right-0 mt-2 p-4 bg-white rounded-lg shadow-lg border z-[70]">
                    <form onSubmit={handleAddList}>
                      <div className="flex items-center space-x-2 mb-4">
                        <span 
                          className="w-4 h-4 rounded-sm" 
                          style={{ backgroundColor: selectedColor }}
                        ></span>
                        <input
                          type="text"
                          placeholder="List Name"
                          value={newListName}
                          onChange={(e) => setNewListName(e.target.value)}
                          className="flex-1 p-2 border-b border-transparent hover:border-gray-300 focus:border-gray-400 focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {listColors.map((color) => (
                          <button
                            key={color}
                            type="button"
                            className={`w-6 h-6 rounded-full transition-transform ${selectedColor === color ? 'scale-125' : 'hover:scale-110'}`}
                            style={{ backgroundColor: color }}
                            onClick={() => setSelectedColor(color)}
                          />
                        ))}
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => setShowNewListForm(false)}
                          className="px-3 py-1 text-gray-600 hover:text-gray-800"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-3 py-1 text-sm bg-gray-800 text-white rounded hover:bg-gray-700"
                        >
                          Add List
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>

            {/* Tags Section */}
            <div className="mb-8">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">TAGS</h2>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map(tag => (
                  <span 
                    key={tag.id}
                    className="px-3 py-1 text-sm flex items-center rounded cursor-pointer"
                    style={{ 
                      backgroundColor: `${tag.color}20`,
                      color: tag.color
                    }}
                    onContextMenu={(e) => handleTagContextMenu(e, tag.id)}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>

              <div className="relative">
                <button 
                  onClick={() => setShowNewTagForm(true)}
                  className="flex items-center w-full p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add New Tag</span>
                </button>

                {/* New Tag Form Popup */}
                {showNewTagForm && (
                  <div className="absolute left-0 right-0 mt-2 p-4 bg-white rounded-lg shadow-lg border">
                    <form onSubmit={handleAddTag}>
                      <div className="flex items-center space-x-2 mb-4">
                        <span 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: selectedTagColor }}
                        ></span>
                        <input
                          type="text"
                          placeholder="Tag Name"
                          value={newTagName}
                          onChange={(e) => setNewTagName(e.target.value)}
                          className="flex-1 p-2 border-b border-transparent hover:border-gray-300 focus:border-gray-400 focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {listColors.map((color) => (
                          <button
                            key={color}
                            type="button"
                            className={`w-6 h-6 rounded-full transition-transform ${selectedTagColor === color ? 'scale-125' : 'hover:scale-110'}`}
                            style={{ backgroundColor: color }}
                            onClick={() => setSelectedTagColor(color)}
                          />
                        ))}
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => setShowNewTagForm(false)}
                          className="px-3 py-1 text-gray-600 hover:text-gray-800"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-3 py-1 text-sm bg-gray-800 text-white rounded hover:bg-gray-700"
                        >
                          Add Tag
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>

            {/* Tag Context Menu */}
            {tagContextMenu.show && (
              <div
                className="fixed bg-white rounded-lg shadow-lg border py-1 z-[60]"
                style={{ top: `${tagContextMenu.y}px`, left: `${tagContextMenu.x}px` }}
              >
                <button
                  onClick={() => handleDeleteTag(tagContextMenu.tagId)}
                  className="w-full px-4 py-2 text-left text-red-500 hover:bg-gray-50"
                >
                  Delete Tag
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Settings and Sign Out - Fixed */}
        <div className="border-t">
          <div className="p-4 space-y-1">
            <button className="flex items-center w-full p-2 hover:bg-gray-100 rounded-lg">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Settings</span>
            </button>
            <button 
              onClick={handleSignOut}
              className="flex items-center w-full p-2 hover:bg-gray-100 rounded-lg text-red-500"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu.show && (
        <div
          className="fixed bg-white rounded-lg shadow-lg border py-1 z-[60]"
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
        >
          <button
            onClick={() => handleDeleteList(contextMenu.listId)}
            className="w-full px-4 py-2 text-left text-red-500 hover:bg-gray-50"
          >
            Delete List
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-80' : 'ml-0'} ${selectedTask ? 'mr-[400px]' : ''}`}>
        <div className="flex justify-center w-full">
          <div className={`${isSidebarOpen ? (selectedTask ? 'w-[817px]' : 'w-[1216px]') : (selectedTask ? 'w-[1136px]' : 'w-[1535px]')} h-screen p-8 overflow-auto`}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                {!isSidebarOpen && (
                  <button 
                    onClick={() => setSidebarOpen(true)}
                    className="p-2 hover:bg-gray-100 rounded-lg bg-white shadow-md mr-4"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                )}
                <div className="flex items-center">
                  <h1 className="text-3xl font-bold mr-3">{selectedList}</h1>
                  <span className="text-2xl text-gray-400">
                    {selectedList !== 'Calendar' ? tasks.filter(task => {
                      if (taskFilter === 'completed') return task.completed && (selectedList === 'Today' ? task.date === new Date().toISOString().split('T')[0] : task.list === selectedList);
                      if (taskFilter === 'pending') return !task.completed && (selectedList === 'Today' ? task.date === new Date().toISOString().split('T')[0] : task.list === selectedList);
                      return selectedList === 'Today' ? task.date === new Date().toISOString().split('T')[0] : task.list === selectedList;
                    }).length : ''}
                  </span>
                </div>
              </div>
              
              {/* Task Filter */}
              {selectedList !== 'Calendar' && selectedList !== 'Sticky Wall' && selectedList !== 'Upcoming' && (
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setTaskFilter('all')}
                    className={`px-4 py-2 text-sm rounded-md transition-all ${taskFilter === 'all' ? 'bg-white shadow text-gray-800' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setTaskFilter('pending')}
                    className={`px-4 py-2 text-sm rounded-md transition-all ${taskFilter === 'pending' ? 'bg-white shadow text-gray-800' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setTaskFilter('completed')}
                    className={`px-4 py-2 text-sm rounded-md transition-all ${taskFilter === 'completed' ? 'bg-white shadow text-gray-800' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    Completed
                  </button>
                </div>
              )}
            </div>

            {/* Add Task Form */}
            {selectedList !== 'Sticky Wall' && selectedList !== 'Upcoming' && selectedList !== 'Calendar' && (
              <div className="mb-8">
                <button 
                  onClick={() => setShowNewTaskForm(true)}
                  className="flex items-center group hover:bg-gray-50 p-3 rounded-lg w-full border border-gray-200"
                >
                  <span className="text-xl text-gray-400 mr-2">+</span>
                  <span className="text-gray-400">Add New Task</span>
                </button>

                {/* New Task Form */}
                {showNewTaskForm && (
                  <div className="mt-3 p-4 bg-white rounded-lg border border-gray-200">
                    <form onSubmit={handleAddTask} className="space-y-4">
                      <div>
                        <input
                          type="text"
                          placeholder="Task name"
                          value={newTaskName}
                          onChange={(e) => setNewTaskName(e.target.value)}
                          className="w-full p-2 border-b border-gray-200 focus:border-gray-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <textarea
                          placeholder="Description"
                          value={newTaskDescription}
                          onChange={(e) => setNewTaskDescription(e.target.value)}
                          rows="3"
                          className="w-full p-2 border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none resize-none"
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setShowNewTaskForm(false);
                            setNewTaskName('');
                            setNewTaskDescription('');
                          }}
                          className="px-4 py-2 text-gray-500 hover:text-gray-700"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                        >
                          Add Task
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* Tasks List */}
            {selectedList === 'Sticky Wall' ? (
              <>
                <div className="grid grid-cols-3 gap-6">
                  {tasks
                    .filter(task => task.list === 'Sticky Wall')
                    .map(task => (
                      <div 
                        key={task.id}
                        className="aspect-square p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer flex flex-col"
                        style={{ backgroundColor: task.color || '#FEF9C3' }}
                        onClick={() => handleTaskClick(task)}
                      >
                        <h3 className="text-xl font-semibold mb-4">{task.text}</h3>
                        <p className="text-gray-600 mb-4 flex-1 overflow-auto whitespace-pre-wrap">
                          {task.description}
                        </p>
                        {/* Task Details */}
                        <div className="flex flex-wrap gap-2">
                          {task.tags?.map(tagId => {
                            const tag = tags.find(t => t.id === tagId);
                            return tag ? (
                              <span 
                                key={tag.id}
                                className="px-2 py-0.5 text-xs flex items-center rounded"
                                style={{ 
                                  backgroundColor: `${tag.color}20`,
                                  color: tag.color
                                }}
                              >
                                <span 
                                  className="w-1.5 h-1.5 mr-1.5 rounded"
                                  style={{ backgroundColor: tag.color }}
                                ></span>
                                {tag.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>
                    ))}
                  {/* Add New Sticky Note */}
                  <div 
                    onClick={() => setShowNewTaskForm(true)}
                    className="aspect-square border-2 border-dashed border-gray-300 rounded-lg p-6 flex items-center justify-center cursor-pointer hover:bg-gray-50"
                  >
                    <div className="text-center">
                      <svg className="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-gray-500">Add New Note</span>
                    </div>
                  </div>
                </div>

                {/* New Task Form */}
                {showNewTaskForm && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 w-[500px]">
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        if (!newTaskName.trim()) return;

                        const task = {
                          id: Date.now(),
                          text: newTaskName,
                          description: newTaskDescription,
                          completed: false,
                          list: 'Sticky Wall',
                          color: newTaskColor
                        };

                        const updatedTasks = [...tasks, task];
                        setTasks(updatedTasks);
                        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
                        
                        setNewTaskName('');
                        setNewTaskDescription('');
                        setNewTaskColor('#FEF9C3');
                        setShowNewTaskForm(false);
                      }} className="space-y-4">
                        <div>
                          <input
                            type="text"
                            placeholder="Note title"
                            value={newTaskName}
                            onChange={(e) => setNewTaskName(e.target.value)}
                            className="w-full p-2 text-xl border-b border-gray-200 focus:border-gray-400 focus:outline-none"
                          />
                        </div>
                        <div>
                          <textarea
                            placeholder="Note content..."
                            value={newTaskDescription}
                            onChange={(e) => setNewTaskDescription(e.target.value)}
                            rows="5"
                            className="w-full p-2 border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none resize-none"
                          />
                        </div>
                        {/* Color Selection */}
                        <div>
                          <h3 className="text-gray-500 mb-2">Note Color</h3>
                          <div className="flex flex-wrap gap-2">
                            {noteColors.map((color) => (
                              <button
                                key={color}
                                type="button"
                                className={`w-8 h-8 rounded-lg transition-transform ${newTaskColor === color ? 'ring-2 ring-gray-400 scale-110' : 'hover:scale-105'}`}
                                style={{ backgroundColor: color }}
                                onClick={() => setNewTaskColor(color)}
                              />
                            ))}
                          </div>
                        </div>
                        <input type="hidden" value="Sticky Wall" name="list" />
                        <div className="flex justify-end space-x-2">
                          <button
                            type="button"
                            onClick={() => {
                              setShowNewTaskForm(false);
                              setNewTaskName('');
                              setNewTaskDescription('');
                              setNewTaskColor('#FEF9C3');
                            }}
                            className="px-4 py-2 text-gray-500 hover:text-gray-700"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                          >
                            Add Note
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </>
            ) : selectedList === 'Upcoming' ? (
              <div className="space-y-8">
                {/* Today's Tasks */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Today</h2>
                  <div className="space-y-2">
                    {getTodaysTasks().map(task => (
                      <div 
                        key={task.id} 
                        className="flex flex-col group hover:bg-gray-50 p-3 rounded-lg border border-gray-200 cursor-pointer"
                        onClick={() => handleTaskClick(task)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center flex-1">
                            <input
                              type="checkbox"
                              checked={task.completed}
                              onChange={(e) => {
                                e.stopPropagation();
                                const updatedTasks = tasks.map(t =>
                                  t.id === task.id ? { ...t, completed: !t.completed } : t
                                );
                                setTasks(updatedTasks);
                                localStorage.setItem('tasks', JSON.stringify(updatedTasks));
                              }}
                              className="w-5 h-5 border-2 border-gray-300 rounded-full focus:ring-0 text-gray-500 mr-3"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <span 
                              className={task.completed ? 'line-through text-gray-400' : ''}
                              onClick={() => handleTaskClick(task)}
                            >
                              {task.text}
                            </span>
                          </div>
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                        {/* Task Details */}
                        <div className="ml-8 mt-2 flex items-center gap-4">
                          {/* Due Date */}
                          {task.date && (
                            <div className="flex items-center text-sm text-gray-500">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {task.date}
                            </div>
                          )}

                          {/* List */}
                          {task.list && (
                            <div className="flex items-center text-sm">
                              {lists.map(list => {
                                if (list.name === task.list) {
                                  return (
                                    <div key={list.id} className="flex items-center">
                                      <span 
                                        className="w-2 h-2 rounded-full mr-2"
                                        style={{ backgroundColor: list.color }}
                                      ></span>
                                      <span className="text-gray-500">{list.name}</span>
                                    </div>
                                  );
                                }
                                return null;
                              })}
                            </div>
                          )}

                          {/* Tags */}
                          {task.tags && task.tags.length > 0 && (
                            <div className="flex items-center gap-2">
                              {task.tags.map(tagId => {
                                const tag = tags.find(t => t.id === tagId);
                                return tag ? (
                                  <span 
                                    key={tag.id}
                                    className="px-2 py-0.5 text-xs flex items-center rounded"
                                    style={{ 
                                      backgroundColor: `${tag.color}20`,
                                      color: tag.color
                                    }}
                                  >
                                    <span 
                                      className="w-1.5 h-1.5 mr-1.5 rounded"
                                      style={{ backgroundColor: tag.color }}
                                    ></span>
                                    {tag.name}
                                  </span>
                                ) : null;
                              })}
                            </div>
                          )}

                          {/* Subtasks Count */}
                          {task.subtasks?.length > 0 && task.subtasks.some(subtask => subtask.text.trim()) && (
                            <div className="flex items-center text-sm text-gray-500">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                              {task.subtasks.filter(subtask => subtask.text.trim()).length} subtask{task.subtasks.filter(subtask => subtask.text.trim()).length !== 1 ? 's' : ''}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tomorrow and This Week in a single row */}
                <div className="grid grid-cols-2 gap-8">
                  {/* Tomorrow's Tasks */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Tomorrow</h2>
                    <div className="space-y-2">
                      {getTomorrowsTasks().map(task => (
                        <div 
                          key={task.id} 
                          className="flex flex-col group hover:bg-gray-50 p-3 rounded-lg border border-gray-200 cursor-pointer"
                          onClick={() => handleTaskClick(task)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center flex-1">
                              <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  const updatedTasks = tasks.map(t =>
                                    t.id === task.id ? { ...t, completed: !t.completed } : t
                                  );
                                  setTasks(updatedTasks);
                                  localStorage.setItem('tasks', JSON.stringify(updatedTasks));
                                }}
                                className="w-5 h-5 border-2 border-gray-300 rounded-full focus:ring-0 text-gray-500 mr-3"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <span 
                                className={task.completed ? 'line-through text-gray-400' : ''}
                                onClick={() => handleTaskClick(task)}
                              >
                                {task.text}
                              </span>
                            </div>
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                          {/* Task Details */}
                          <div className="ml-8 mt-2 flex items-center gap-4">
                            {/* Due Date */}
                            {task.date && (
                              <div className="flex items-center text-sm text-gray-500">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {task.date}
                              </div>
                            )}

                            {/* List */}
                            {task.list && (
                              <div className="flex items-center text-sm">
                                {lists.map(list => {
                                  if (list.name === task.list) {
                                    return (
                                      <div key={list.id} className="flex items-center">
                                        <span 
                                          className="w-2 h-2 rounded-full mr-2"
                                          style={{ backgroundColor: list.color }}
                                        ></span>
                                        <span className="text-gray-500">{list.name}</span>
                                      </div>
                                    );
                                  }
                                  return null;
                                })}
                              </div>
                            )}

                            {/* Tags */}
                            {task.tags && task.tags.length > 0 && (
                              <div className="flex items-center gap-2">
                                {task.tags.map(tagId => {
                                  const tag = tags.find(t => t.id === tagId);
                                  return tag ? (
                                    <span 
                                      key={tag.id}
                                      className="px-2 py-0.5 text-xs flex items-center rounded"
                                      style={{ 
                                        backgroundColor: `${tag.color}20`,
                                        color: tag.color
                                      }}
                                    >
                                      <span 
                                        className="w-1.5 h-1.5 mr-1.5 rounded"
                                        style={{ backgroundColor: tag.color }}
                                      ></span>
                                      {tag.name}
                                    </span>
                                  ) : null;
                                })}
                              </div>
                            )}

                            {/* Subtasks Count */}
                            {task.subtasks?.length > 0 && task.subtasks.some(subtask => subtask.text.trim()) && (
                              <div className="flex items-center text-sm text-gray-500">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                {task.subtasks.filter(subtask => subtask.text.trim()).length} subtask{task.subtasks.filter(subtask => subtask.text.trim()).length !== 1 ? 's' : ''}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* This Week's Tasks */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4">This Week</h2>
                    <div className="space-y-2">
                      {getThisWeeksTasks().map(task => (
                        <div 
                          key={task.id} 
                          className="flex flex-col group hover:bg-gray-50 p-3 rounded-lg border border-gray-200 cursor-pointer"
                          onClick={() => handleTaskClick(task)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center flex-1">
                              <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  const updatedTasks = tasks.map(t =>
                                    t.id === task.id ? { ...t, completed: !t.completed } : t
                                  );
                                  setTasks(updatedTasks);
                                  localStorage.setItem('tasks', JSON.stringify(updatedTasks));
                                }}
                                className="w-5 h-5 border-2 border-gray-300 rounded-full focus:ring-0 text-gray-500 mr-3"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <span 
                                className={task.completed ? 'line-through text-gray-400' : ''}
                                onClick={() => handleTaskClick(task)}
                              >
                                {task.text}
                              </span>
                            </div>
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                          {/* Task Details */}
                          <div className="ml-8 mt-2 flex items-center gap-4">
                            {/* Due Date */}
                            {task.date && (
                              <div className="flex items-center text-sm text-gray-500">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {task.date}
                              </div>
                            )}

                            {/* List */}
                            {task.list && (
                              <div className="flex items-center text-sm">
                                {lists.map(list => {
                                  if (list.name === task.list) {
                                    return (
                                      <div key={list.id} className="flex items-center">
                                        <span 
                                          className="w-2 h-2 rounded-full mr-2"
                                          style={{ backgroundColor: list.color }}
                                        ></span>
                                        <span className="text-gray-500">{list.name}</span>
                                      </div>
                                    );
                                  }
                                  return null;
                                })}
                              </div>
                            )}

                            {/* Tags */}
                            {task.tags && task.tags.length > 0 && (
                              <div className="flex items-center gap-2">
                                {task.tags.map(tagId => {
                                  const tag = tags.find(t => t.id === tagId);
                                  return tag ? (
                                    <span 
                                      key={tag.id}
                                      className="px-2 py-0.5 text-xs flex items-center rounded"
                                      style={{ 
                                        backgroundColor: `${tag.color}20`,
                                        color: tag.color
                                      }}
                                    >
                                      <span 
                                        className="w-1.5 h-1.5 mr-1.5 rounded"
                                        style={{ backgroundColor: tag.color }}
                                      ></span>
                                      {tag.name}
                                    </span>
                                  ) : null;
                                })}
                              </div>
                            )}

                            {/* Subtasks Count */}
                            {task.subtasks?.length > 0 && task.subtasks.some(subtask => subtask.text.trim()) && (
                              <div className="flex items-center text-sm text-gray-500">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                {task.subtasks.filter(subtask => subtask.text.trim()).length} subtask{task.subtasks.filter(subtask => subtask.text.trim()).length !== 1 ? 's' : ''}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : selectedList === 'Calendar' ? (
              <div>
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <h1 className="text-3xl font-bold">
                      {calendarView === 'week' ? formatDateRange() : formatDate(currentDate)}
                    </h1>
                    <div className="flex">
                      <button 
                        className={`p-2 hover:bg-gray-100 rounded-lg ${calendarView === 'week' ? 'invisible' : ''}`}
                        onClick={() => {
                          if (calendarView !== 'week') {
                            const newDate = new Date(currentDate);
                            if (calendarView === 'month') {
                              newDate.setMonth(currentDate.getMonth() - 1);
                            } else {
                              newDate.setDate(currentDate.getDate() - 1);
                            }
                            setCurrentDate(newDate);
                          }
                        }}
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button 
                        className={`p-2 hover:bg-gray-100 rounded-lg ${calendarView === 'week' ? 'invisible' : ''}`}
                        onClick={() => {
                          if (calendarView !== 'week') {
                            const newDate = new Date(currentDate);
                            if (calendarView === 'month') {
                              newDate.setMonth(currentDate.getMonth() + 1);
                            } else {
                              newDate.setDate(currentDate.getDate() + 1);
                            }
                            setCurrentDate(newDate);
                          }
                        }}
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowEventForm(true)}
                    className="px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-50"
                  >
                    Add Event
                  </button>
                </div>

                {/* Event Form Modal */}
                {showEventForm && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 w-[500px]">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-semibold">Add New Event</h2>
                        <button 
                          onClick={() => {
                            setShowEventForm(false);
                            setNewEvent({
                              title: '',
                              description: '',
                              date: '',
                              startTime: '',
                              startMeridiem: 'AM',
                              endTime: '',
                              endMeridiem: 'AM'
                            });
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      <form onSubmit={(e) => {
                        e.preventDefault();
                        const event = {
                          id: Date.now(),
                          text: newEvent.title,
                          description: newEvent.description,
                          date: newEvent.date,
                          time: newEvent.startTime,
                          meridiem: newEvent.startMeridiem,
                          endTime: newEvent.endTime,
                          endMeridiem: newEvent.endMeridiem,
                          type: 'event'
                        };

                        const updatedTasks = [...tasks, event];
                        setTasks(updatedTasks);
                        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
                        
                        setNewEvent({
                          title: '',
                          description: '',
                          date: '',
                          startTime: '',
                          startMeridiem: 'AM',
                          endTime: '',
                          endMeridiem: 'AM'
                        });
                        setShowEventForm(false);
                      }} className="space-y-4">
                        {/* Event Form Fields */}
                        <div>
                          <input
                            type="text"
                            placeholder="Event title"
                            value={newEvent.title}
                            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                            className="w-full p-2 border-b border-gray-200 focus:border-gray-400 focus:outline-none"
                          />
                        </div>
                        <div>
                          <textarea
                            placeholder="Description"
                            value={newEvent.description}
                            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                            rows="3"
                            className="w-full p-2 border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none resize-none"
                          />
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <label className="block text-gray-500 mb-1">Date</label>
                            <input
                              type="date"
                              value={newEvent.date}
                              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                              className="w-full p-2 border border-gray-200 rounded focus:border-gray-400 focus:outline-none"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-500 mb-1">Start Time</label>
                            <div className="flex space-x-2">
                              <input
                                type="time"
                                value={newEvent.startTime}
                                onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                                className="flex-1 p-2 border border-gray-200 rounded focus:border-gray-400 focus:outline-none"
                              />
                              <select
                                value={newEvent.startMeridiem}
                                onChange={(e) => setNewEvent({ ...newEvent, startMeridiem: e.target.value })}
                                className="p-2 border border-gray-200 rounded focus:border-gray-400 focus:outline-none"
                              >
                                <option value="AM">AM</option>
                                <option value="PM">PM</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="block text-gray-500 mb-1">End Time</label>
                            <div className="flex space-x-2">
                              <input
                                type="time"
                                value={newEvent.endTime}
                                onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                                className="flex-1 p-2 border border-gray-200 rounded focus:border-gray-400 focus:outline-none"
                              />
                              <select
                                value={newEvent.endMeridiem}
                                onChange={(e) => setNewEvent({ ...newEvent, endMeridiem: e.target.value })}
                                className="p-2 border border-gray-200 rounded focus:border-gray-400 focus:outline-none"
                              >
                                <option value="AM">AM</option>
                                <option value="PM">PM</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2 pt-4">
                          <button
                            type="button"
                            onClick={() => {
                              setShowEventForm(false);
                              setNewEvent({
                                title: '',
                                description: '',
                                date: '',
                                startTime: '',
                                startMeridiem: 'AM',
                                endTime: '',
                                endMeridiem: 'AM'
                              });
                            }}
                            className="px-4 py-2 text-gray-500 hover:text-gray-700"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                          >
                            Add Event
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* View Tabs */}
                <div className="flex bg-gray-100 rounded-lg p-1 w-fit mb-6">
                  <button 
                    className={`px-4 py-2 text-sm rounded-md ${calendarView === 'day' ? 'bg-white shadow' : 'hover:bg-gray-50'}`}
                    onClick={() => setCalendarView('day')}
                  >
                    Day
                  </button>
                  <button 
                    className={`px-4 py-2 text-sm rounded-md ${calendarView === 'week' ? 'bg-white shadow' : 'hover:bg-gray-50'}`}
                    onClick={() => setCalendarView('week')}
                  >
                    Week
                  </button>
                  <button 
                    className={`px-4 py-2 text-sm rounded-md ${calendarView === 'month' ? 'bg-white shadow' : 'hover:bg-gray-50'}`}
                    onClick={() => setCalendarView('month')}
                  >
                    Month
                  </button>
                </div>

                {calendarView === 'day' ? (
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-4">
                      {currentDate.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()}
                    </div>
                    <div className="space-y-4">
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i;
                        const meridiem = hour >= 12 ? 'PM' : 'AM';
                        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                        
                        // Filter tasks for this time slot
                        const timeSlotTasks = tasks.filter(task => {
                          if (!task.date || !task.time) return false;
                          const taskDate = new Date(task.date);
                          const currentDateStr = currentDate.toISOString().split('T')[0];
                          const taskDateStr = taskDate.toISOString().split('T')[0];
                          
                          // Parse the task time
                          const [taskHourStr, taskMinute] = task.time.split(':');
                          let taskHour = parseInt(taskHourStr);
                          
                          // Convert to 24-hour format based on meridiem
                          if (task.meridiem === 'PM' && taskHour !== 12) {
                            taskHour += 12;
                          } else if (task.meridiem === 'AM' && taskHour === 12) {
                            taskHour = 0;
                          }
                          
                          // Match only the hour part, ignoring minutes
                          return taskDateStr === currentDateStr && taskHour === hour;
                        });

                        return (
                          <div key={hour} className="flex items-start">
                            <div className="w-20 text-right pr-4 text-sm text-gray-500">
                              {displayHour}:00<br/>{meridiem}
                            </div>
                            <div className="flex-1 relative min-h-[100px]">
                              {/* Time indicator line */}
                              <div className="absolute left-0 right-0 border-t border-gray-200"></div>
                              
                              {/* Tasks/Events */}
                              <div className="space-y-2 mt-2">
                                {timeSlotTasks.map((task, index) => {
                                  // Get the list color for the task
                                  const taskList = lists.find(list => list.name === task.list);
                                  const backgroundColor = task.list ? (taskList ? `${taskList.color}20` : '#EBF5FF') : '#FFFFFF';
                                  
                                  return (
                                    <div 
                                      key={task.id}
                                      className="p-4 rounded-lg cursor-pointer border border-gray-200"
                                      style={{ 
                                        backgroundColor: backgroundColor
                                      }}
                                      onClick={() => handleTaskClick(task)}
                                    >
                                      <h3 className="font-medium">{task.text}</h3>
                                      {task.description && (
                                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : calendarView === 'week' ? (
                  <div>
                    {/* Week View Header */}
                    <div className="grid grid-cols-7 mb-4">
                      {Array.from({ length: 7 }, (_, index) => {
                        const date = new Date(2024, 3, 14); // April 14, 2024
                        const nextDay = new Date(date);
                        nextDay.setDate(date.getDate() + index);
                        
                        return (
                          <div key={index} className="text-center">
                            <div className="text-sm font-medium text-gray-500 mb-1">{weekDays[index]}</div>
                            <div className="text-sm">
                              {nextDay.getDate()} {nextDay.toLocaleString('default', { month: 'short' })}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Time slots with events */}
                    <div className="space-y-4">
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i;
                        const meridiem = hour >= 12 ? 'PM' : 'AM';
                        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                        
                        return (
                          <div key={hour} className="flex items-start">
                            <div className="w-20 text-right pr-4 text-sm text-gray-500">
                              {displayHour}:00<br/>{meridiem}
                            </div>
                            <div className="flex-1 grid grid-cols-7 gap-2">
                              {weekDays.map((day, index) => {
                                const date = new Date(currentDate);
                                date.setDate(currentDate.getDate() - currentDate.getDay() + index);
                                const dateStr = date.toISOString().split('T')[0];

                                // Filter tasks for this time slot and day
                                const timeSlotTasks = tasks.filter(task => {
                                  if (!task.date || !task.time) return false;
                                  
                                  // Parse the task time
                                  const [taskHourStr, taskMinute] = task.time.split(':');
                                  let taskHour = parseInt(taskHourStr);
                                  
                                  // Convert to 24-hour format based on meridiem
                                  if (task.meridiem === 'PM' && taskHour !== 12) {
                                    taskHour += 12;
                                  } else if (task.meridiem === 'AM' && taskHour === 12) {
                                    taskHour = 0;
                                  }
                                  
                                  return task.date === dateStr && taskHour === hour;
                                });

                                return (
                                  <div key={day} className="relative min-h-[100px]">
                                    {/* Time indicator line */}
                                    <div className="absolute left-0 right-0 border-t border-gray-200"></div>
                                    
                                    {/* Tasks/Events */}
                                    <div className="space-y-2 mt-2">
                                      {timeSlotTasks.map(task => {
                                        const taskList = lists.find(list => list.name === task.list);
                                        const backgroundColor = task.list ? (taskList ? `${taskList.color}20` : '#EBF5FF') : '#FFFFFF';
                                        
                                        return (
                                          <div 
                                            key={task.id}
                                            className="p-2 rounded-lg cursor-pointer border border-gray-200"
                                            style={{ backgroundColor }}
                                            onClick={() => handleTaskClick(task)}
                                          >
                                            <h3 className="text-sm font-medium truncate">{task.text}</h3>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* Month View Header */}
                    <div className="grid grid-cols-7 mb-4">
                      {weekDays.map(day => (
                        <div key={day} className="text-sm font-medium text-gray-500">
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-px bg-gray-200">
                      {Array.from({ length: 42 }, (_, i) => {
                        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                        const firstDayWeekday = firstDayOfMonth.getDay();
                        const date = new Date(firstDayOfMonth);
                        date.setDate(1 - firstDayWeekday + i);
                        
                        const dateStr = date.toISOString().split('T')[0];
                        const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                        
                        // Get all tasks for this date
                        const dayTasks = tasks.filter(task => {
                          const taskDate = task.date ? new Date(task.date) : null;
                          return taskDate && 
                            taskDate.getDate() === date.getDate() &&
                            taskDate.getMonth() === date.getMonth() &&
                            taskDate.getFullYear() === date.getFullYear();
                        });

                        return (
                          <div key={i} className="bg-white p-2 min-h-[120px]">
                            <span className={`${isCurrentMonth ? 'font-medium' : 'text-gray-400'}`}>
                              {date.getDate()}
                            </span>
                            <div className="mt-1 space-y-1 overflow-y-auto max-h-[100px]">
                              {dayTasks.map(task => (
                                <div
                                  key={task.id}
                                  className={`w-full h-6 rounded-md px-2 py-1 text-xs truncate cursor-pointer hover:opacity-80 flex items-center`}
                                  style={{ backgroundColor: task.color || '#E5EDFF' }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleTaskClick(task);
                                  }}
                                >
                                  <span className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: task.list ? lists.find(l => l.name === task.list)?.color : '#6B7AFF' }}></span>
                                  <span>{task.text}</span>
                                  {task.time && (
                                    <span className="ml-auto text-gray-600">{task.time}</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {tasks
                  .filter(task => {
                    // First filter by list
                    const listFilter = selectedList === 'Today' 
                      ? task.date === new Date().toISOString().split('T')[0]
                      : task.list === selectedList;

                    // Then apply completion status filter
                    if (taskFilter === 'completed') return listFilter && task.completed;
                    if (taskFilter === 'pending') return listFilter && !task.completed;
                    return listFilter; // 'all' filter
                  })
                  .map(task => (
                    <div 
                      key={task.id} 
                      className="flex flex-col group hover:bg-gray-50 p-3 rounded-lg border border-gray-200 cursor-pointer"
                      onClick={() => handleTaskClick(task)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center flex-1">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={(e) => {
                              e.stopPropagation();
                              const updatedTasks = tasks.map(t =>
                                t.id === task.id ? { ...t, completed: !t.completed } : t
                              );
                              setTasks(updatedTasks);
                              localStorage.setItem('tasks', JSON.stringify(updatedTasks));
                            }}
                            className="w-5 h-5 border-2 border-gray-300 rounded-full focus:ring-0 text-gray-500 mr-3"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <span 
                            className={task.completed ? 'line-through text-gray-400' : ''}
                            onClick={() => handleTaskClick(task)}
                          >
                            {task.text}
                          </span>
                        </div>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>

                      {/* Task Details */}
                      <div className="ml-8 mt-2 flex items-center gap-4">
                        {/* Due Date */}
                        {task.date && (
                          <div className="flex items-center text-sm text-gray-500">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {task.date}
                          </div>
                        )}

                        {/* List */}
                        {task.list && (
                          <div className="flex items-center text-sm">
                            {lists.map(list => {
                              if (list.name === task.list) {
                                return (
                                  <div key={list.id} className="flex items-center">
                                    <span 
                                      className="w-2 h-2 rounded-full mr-2"
                                      style={{ backgroundColor: list.color }}
                                    ></span>
                                    <span className="text-gray-500">{list.name}</span>
                                  </div>
                                );
                              }
                              return null;
                            })}
                          </div>
                        )}

                        {/* Tags */}
                        {task.tags && task.tags.length > 0 && (
                          <div className="flex items-center gap-2">
                            {task.tags.map(tagId => {
                              const tag = tags.find(t => t.id === tagId);
                              return tag ? (
                                <span 
                                  key={tag.id}
                                  className="px-2 py-0.5 text-xs flex items-center rounded"
                                  style={{ 
                                    backgroundColor: `${tag.color}20`,
                                    color: tag.color
                                  }}
                                >
                                  <span 
                                    className="w-1.5 h-1.5 mr-1.5 rounded"
                                    style={{ backgroundColor: tag.color }}
                                  ></span>
                                  {tag.name}
                                </span>
                              ) : null;
                            })}
                          </div>
                        )}

                        {/* Subtasks Count */}
                        {task.subtasks?.length > 0 && task.subtasks.some(subtask => subtask.text.trim()) && (
                          <div className="flex items-center text-sm text-gray-500">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            {task.subtasks.filter(subtask => subtask.text.trim()).length} subtask{task.subtasks.filter(subtask => subtask.text.trim()).length !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Task Details Form */}
        {selectedTask && (
          <div className="fixed top-0 right-0 h-screen w-[400px] bg-white shadow-lg border-l border-gray-200 overflow-y-auto z-50">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold">Task:</h2>
                <button 
                  onClick={() => setSelectedTask(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Task Name */}
                <input
                  type="text"
                  value={selectedTask.text}
                  onChange={(e) => {
                    const updatedTasks = tasks.map(t =>
                      t.id === selectedTask.id ? { ...t, text: e.target.value } : t
                    );
                    setTasks(updatedTasks);
                    setSelectedTask({ ...selectedTask, text: e.target.value });
                    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
                  }}
                  className="w-full text-lg border-b border-transparent hover:border-gray-300 focus:border-gray-400 focus:outline-none pb-2"
                />

                {/* Description */}
                <div>
                  <h3 className="text-gray-500 mb-2">Description</h3>
                  <textarea
                    value={selectedTask.description || ''}
                    onChange={(e) => {
                      const updatedTasks = tasks.map(t =>
                        t.id === selectedTask.id ? { ...t, description: e.target.value } : t
                      );
                      setTasks(updatedTasks);
                      setSelectedTask({ ...selectedTask, description: e.target.value });
                      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
                    }}
                    className="w-full h-32 p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                    placeholder="Add a description..."
                  />
                </div>

                {/* List Selection */}
                <div>
                  <h3 className="text-gray-500 mb-2">List</h3>
                  <select
                    value={selectedTask.list || ''}
                    onChange={(e) => {
                      const updatedTasks = tasks.map(t =>
                        t.id === selectedTask.id ? { ...t, list: e.target.value } : t
                      );
                      setTasks(updatedTasks);
                      setSelectedTask({ ...selectedTask, list: e.target.value });
                      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
                    }}
                    className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-gray-400"
                  >
                    <option value="">Select a list</option>
                    {lists.map(list => (
                      <option key={list.id} value={list.name}>{list.name}</option>
                    ))}
                  </select>
                </div>

                {/* Due Date */}
                <div>
                  <h3 className="text-gray-500 mb-2">Due date</h3>
                  <input
                    type="date"
                    value={selectedTask.date || ''}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => {
                      const updatedTasks = tasks.map(t =>
                        t.id === selectedTask.id ? { ...t, date: e.target.value } : t
                      );
                      setTasks(updatedTasks);
                      setSelectedTask({ ...selectedTask, date: e.target.value });
                      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
                    }}
                    className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-gray-400"
                  />
                </div>

                {/* Time */}
                <div>
                  <h3 className="text-gray-500 mb-2">Time</h3>
                  <div className="flex items-center space-x-2">
                    <input
                      type="time"
                      value={selectedTask.time || ''}
                      onChange={(e) => {
                        const updatedTasks = tasks.map(t =>
                          t.id === selectedTask.id ? { ...t, time: e.target.value } : t
                        );
                        setTasks(updatedTasks);
                        setSelectedTask({ ...selectedTask, time: e.target.value });
                        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
                      }}
                      className="flex-1 p-2 border border-gray-200 rounded focus:outline-none focus:border-gray-400"
                    />
                    <select
                      value={selectedTask.meridiem || 'AM'}
                      onChange={(e) => {
                        const updatedTasks = tasks.map(t =>
                          t.id === selectedTask.id ? { ...t, meridiem: e.target.value } : t
                        );
                        setTasks(updatedTasks);
                        setSelectedTask({ ...selectedTask, meridiem: e.target.value });
                        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
                      }}
                      className="p-2 border border-gray-200 rounded focus:outline-none focus:border-gray-400"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <h3 className="text-gray-500 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map(tag => (
                      <span 
                        key={tag.id}
                        className={`px-3 py-1 text-sm flex items-center rounded cursor-pointer ${selectedTask.tags?.includes(tag.id) ? 'ring-2 ring-gray-400' : ''}`}
                        style={{ 
                          backgroundColor: `${tag.color}20`,
                          color: tag.color
                        }}
                        onClick={() => {
                          const updatedTask = {
                            ...selectedTask,
                            tags: selectedTask.tags?.includes(tag.id)
                              ? selectedTask.tags.filter(id => id !== tag.id)
                              : [...(selectedTask.tags || []), tag.id]
                          };
                          setSelectedTask(updatedTask);
                          const updatedTasks = tasks.map(t =>
                            t.id === selectedTask.id ? updatedTask : t
                          );
                          setTasks(updatedTasks);
                          localStorage.setItem('tasks', JSON.stringify(updatedTasks));
                        }}
                      >
                        <span 
                          className="w-2 h-2 mr-2 rounded"
                          style={{ backgroundColor: tag.color }}
                        ></span>
                        {tag.name}
                      </span>
                    ))}
                    <button 
                      onClick={() => setShowTaskTagForm(true)}
                      className="px-3 py-1 text-sm text-gray-500 border border-gray-200 rounded hover:bg-gray-50"
                    >
                      + Add Tag
                    </button>
                  </div>

                  {/* New Tag Form Popup in Task Edit */}
                  {showTaskTagForm && (
                    <div className="absolute left-0 right-0 mt-2 p-4 bg-white rounded-lg shadow-lg border">
                      <form onSubmit={handleAddTag}>
                        <div className="flex items-center space-x-2 mb-4">
                          <span 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: selectedTagColor }}
                          ></span>
                          <input
                            type="text"
                            placeholder="Tag Name"
                            value={newTagName}
                            onChange={(e) => setNewTagName(e.target.value)}
                            className="flex-1 p-2 border-b border-transparent hover:border-gray-300 focus:border-gray-400 focus:outline-none"
                          />
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {listColors.map((color) => (
                            <button
                              key={color}
                              type="button"
                              className={`w-6 h-6 rounded-full transition-transform ${selectedTagColor === color ? 'scale-125' : 'hover:scale-110'}`}
                              style={{ backgroundColor: color }}
                              onClick={() => setSelectedTagColor(color)}
                            />
                          ))}
                        </div>
                        <div className="flex justify-end space-x-2">
                          <button
                            type="button"
                            onClick={() => setShowTaskTagForm(false)}
                            className="px-3 py-1 text-gray-600 hover:text-gray-800"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-3 py-1 text-sm bg-gray-800 text-white rounded hover:bg-gray-700"
                          >
                            Add Tag
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>

                {/* Subtasks */}
                <div>
                  <h3 className="text-gray-500 mb-2">Subtasks:</h3>
                  <button 
                    onClick={() => {
                      const updatedTask = {
                        ...selectedTask,
                        subtasks: [
                          ...(selectedTask.subtasks || []),
                          { id: Date.now(), text: '', completed: false }
                        ]
                      };
                      setSelectedTask(updatedTask);
                      const updatedTasks = tasks.map(t =>
                        t.id === selectedTask.id ? updatedTask : t
                      );
                      setTasks(updatedTasks);
                      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
                    }}
                    className="flex items-center text-gray-500 hover:text-gray-700 mb-4"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add New Subtask
                  </button>
                  <div className="space-y-2">
                    {(selectedTask.subtasks || []).map((subtask, index) => (
                      <div key={subtask.id || index} className="flex items-center group">
                        <input
                          type="checkbox"
                          checked={subtask.completed}
                          onChange={() => {
                            const updatedSubtasks = [...(selectedTask.subtasks || [])];
                            updatedSubtasks[index] = {
                              ...updatedSubtasks[index],
                              completed: !updatedSubtasks[index].completed
                            };
                            const updatedTask = {
                              ...selectedTask,
                              subtasks: updatedSubtasks
                            };
                            setSelectedTask(updatedTask);
                            const updatedTasks = tasks.map(t =>
                              t.id === selectedTask.id ? updatedTask : t
                            );
                            setTasks(updatedTasks);
                            localStorage.setItem('tasks', JSON.stringify(updatedTasks));
                          }}
                          className="w-4 h-4 border-2 border-gray-300 rounded focus:ring-0 text-gray-500 mr-3"
                        />
                        <input
                          type="text"
                          value={subtask.text}
                          onChange={(e) => {
                            const updatedSubtasks = [...(selectedTask.subtasks || [])];
                            updatedSubtasks[index] = {
                              ...updatedSubtasks[index],
                              text: e.target.value
                            };
                            const updatedTask = {
                              ...selectedTask,
                              subtasks: updatedSubtasks
                            };
                            setSelectedTask(updatedTask);
                            const updatedTasks = tasks.map(t =>
                              t.id === selectedTask.id ? updatedTask : t
                            );
                            setTasks(updatedTasks);
                            localStorage.setItem('tasks', JSON.stringify(updatedTasks));
                          }}
                          className="flex-1 border-b border-transparent hover:border-gray-300 focus:border-gray-400 focus:outline-none"
                          placeholder="Subtask"
                        />
                        <button
                          onClick={() => {
                            const updatedSubtasks = selectedTask.subtasks.filter((_, i) => i !== index);
                            const updatedTask = {
                              ...selectedTask,
                              subtasks: updatedSubtasks
                            };
                            setSelectedTask(updatedTask);
                            const updatedTasks = tasks.map(t =>
                              t.id === selectedTask.id ? updatedTask : t
                            );
                            setTasks(updatedTasks);
                            localStorage.setItem('tasks', JSON.stringify(updatedTasks));
                          }}
                          className="opacity-0 group-hover:opacity-100 ml-2 text-gray-400 hover:text-gray-600"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => {
                      const updatedTasks = tasks.filter(t => t.id !== selectedTask.id);
                      setTasks(updatedTasks);
                      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
                      setSelectedTask(null);
                    }}
                    className="px-6 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Delete Task
                  </button>
                  <button
                    onClick={() => {
                      const updatedTasks = tasks.map(t =>
                        t.id === selectedTask.id ? selectedTask : t
                      );
                      setTasks(updatedTasks);
                      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
                      setSelectedTask(null);
                    }}
                    className="px-6 py-2 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                  >
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoList; 