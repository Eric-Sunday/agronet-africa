import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Mic, MicOff, Square, Play, Pause, Users, MessageCircle,
  Heart, Share2, MoreHorizontal, MapPin, Send, BookOpen,
  Award, CheckCircle, Leaf, ChevronRight, Volume2, Clock,
  Sparkles, Radio, Waves, WifiOff
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// ===== Backend API URL =====
import { API_BASE } from '../lib/api';
const API_URL = API_BASE;

// ===== SEED POSTS =====
const SEED_POSTS = [
  {
    id: 'post_001',
    author: 'Amara Diallo',
    location: 'Bamako, Mali',
    avatar: 'AD',
    avatarColor: 'from-agro-400 to-agro-600',
    timestamp: '2 hours ago',
    text: 'Just finished planting my second season of cowpeas using the ridge-and-furrow technique. The soil moisture retention has improved by almost 40%! Anyone else tried this in the Sahel region?',
    type: 'text',
    likes: 24,
    replies: 7,
    liked: false,
  },
  {
    id: 'post_002',
    author: 'Fatima Osei',
    location: 'Kumasi, Ghana',
    avatar: 'FO',
    avatarColor: 'from-earth-400 to-earth-600',
    timestamp: '4 hours ago',
    text: 'Voice note from the greenhouse ðŸŒ¿',
    type: 'audio',
    audioDuration: '0:32',
    audioLabel: 'Greenhouse temperature update',
    likes: 18,
    replies: 3,
    liked: false,
  },
  {
    id: 'post_003',
    author: 'Chidi Eze',
    location: 'Enugu, Nigeria',
    avatar: 'CE',
    avatarColor: 'from-soil-400 to-soil-600',
    timestamp: '6 hours ago',
    text: 'Warning to all catfish farmers in the southeast: water temperature dropped sharply last night. Lost 300 fingerlings. Please monitor your ponds carefully this week. Stay safe out there ðŸ™',
    type: 'text',
    likes: 51,
    replies: 14,
    liked: false,
  },
  {
    id: 'post_004',
    author: 'Ngozi Adeyemi',
    location: 'Abuja, Nigeria',
    avatar: 'NA',
    avatarColor: 'from-purple-400 to-purple-600',
    timestamp: '1 day ago',
    text: 'Field update â€” recording from my tomato farm',
    type: 'audio',
    audioDuration: '1:04',
    audioLabel: 'Pest control success story',
    likes: 39,
    replies: 11,
    liked: false,
  },
  {
    id: 'post_005',
    author: 'Kofi Mensah',
    location: 'Accra, Ghana',
    avatar: 'KM',
    avatarColor: 'from-agro-500 to-agro-700',
    timestamp: '1 day ago',
    text: 'Just completed my GAP certification through AgroNet! If you haven\'t taken the Micro-Learning module yet, please do it. It changed how I think about food safety on my farm entirely.',
    type: 'text',
    likes: 67,
    replies: 22,
    liked: false,
  },
];

// ===== AUDIO WAVEFORM ANIMATION =====
function AudioWave({ isRecording }) {
  const bars = [4, 7, 5, 9, 6, 11, 8, 6, 10, 7, 5, 8, 6, 9, 4];
  return (
    <div className="flex items-center gap-0.5 h-10">
      {bars.map((height, i) => (
        <div
          key={i}
          className={`w-1 rounded-full transition-all ${
            isRecording ? 'bg-red-400 animate-bounce' : 'bg-gray-300'
          }`}
          style={{
            height: isRecording ? `${height * 3}px` : '4px',
            animationDelay: `${i * 60}ms`,
            animationDuration: `${400 + (i % 4) * 100}ms`,
          }}
        />
      ))}
    </div>
  );
}

// ===== MOCK AUDIO PLAYER =====
function AudioPlayer({ post }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);

  const togglePlay = () => {
    if (isPlaying) {
      clearInterval(intervalRef.current);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      intervalRef.current = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(intervalRef.current);
            setIsPlaying(false);
            return 0;
          }
          return p + 1;
        });
      }, 300);
    }
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  return (
    <div className="mt-3 bg-gradient-to-r from-agro-50 to-agro-100 rounded-2xl p-4 border border-agro-200">
      <p className="text-xs font-semibold text-agro-600 mb-3 flex items-center gap-1.5">
        <Volume2 className="w-3.5 h-3.5" /> {post.audioLabel}
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={togglePlay}
          className="w-10 h-10 bg-agro-600 rounded-full flex items-center justify-center shadow-md shadow-agro-500/30 hover:bg-agro-500 active:scale-95 transition-all duration-200 flex-shrink-0"
        >
          {isPlaying
            ? <Pause className="w-4 h-4 text-white" />
            : <Play className="w-4 h-4 text-white ml-0.5" />
          }
        </button>
        <div className="flex-1">
          <div className="w-full h-2 bg-agro-200 rounded-full overflow-hidden cursor-pointer">
            <div
              className="h-full bg-gradient-to-r from-agro-500 to-agro-400 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-agro-500 font-medium">
              {isPlaying ? 'â–¶ Playing...' : 'â— Audio Note'}
            </span>
            <span className="text-xs text-gray-400">{post.audioDuration}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== POST CARD =====
function PostCard({ post, onUpdate }) {
  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(l => liked ? l - 1 : l + 1);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Author row */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 bg-gradient-to-br ${post.avatarColor} rounded-xl flex items-center justify-center shadow-sm flex-shrink-0`}>
            <span className="text-white text-sm font-bold">{post.avatar}</span>
          </div>
          <div>
            <p className="font-display font-bold text-gray-900 text-sm">{post.author}</p>
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {post.location} Â· {post.timestamp}
            </p>
          </div>
        </div>
        <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <p className="text-sm text-gray-700 leading-relaxed">{post.text}</p>
      {post.type === 'audio' && <AudioPlayer post={post} />}

      {/* Actions */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-50">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-sm font-medium transition-all duration-200 ${
            liked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
          }`}
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-red-500' : ''}`} />
          {likes}
        </button>
        <button className="flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-agro-600 transition-colors">
          <MessageCircle className="w-4 h-4" />
          {post.replies}
        </button>
        <button className="flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-agro-600 transition-colors ml-auto">
          <Share2 className="w-4 h-4" />
          Share
        </button>
      </div>
    </div>
  );
}

// ===== AUDIO RECORDER =====
function AudioRecorder({ onPost }) {
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const startRecording = () => {
    setIsRecording(true);
    setSeconds(0);
    intervalRef.current = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
  };

  const stopRecording = () => {
    clearInterval(intervalRef.current);
    const duration = formatTime(seconds);
    setIsRecording(false);
    setSeconds(0);
    onPost(duration);
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  return (
    <div className={`rounded-2xl border-2 p-5 transition-all duration-300 ${
      isRecording
        ? 'border-red-300 bg-red-50/50'
        : 'border-dashed border-gray-200 bg-gray-50/50'
    }`}>
      {isRecording ? (
        <div className="flex flex-col items-center gap-4">
          {/* Live timer */}
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-2xl font-mono font-bold text-red-600 tabular-nums">
              {formatTime(seconds)}
            </span>
            <span className="text-sm text-red-400 font-medium">Recording...</span>
          </div>

          {/* Waveform */}
          <AudioWave isRecording={isRecording} />

          {/* Stop button */}
          <button
            id="stop-recording-btn"
            onClick={stopRecording}
            className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-500/25 hover:bg-red-600 active:scale-[0.98] transition-all duration-200"
          >
            <Square className="w-4 h-4 fill-white" />
            Stop Recording
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-2">
          <button
            id="start-recording-btn"
            onClick={startRecording}
            className="group relative w-20 h-20 bg-gradient-to-br from-agro-500 to-agro-600 rounded-full flex flex-col items-center justify-center shadow-xl shadow-agro-500/30 hover:shadow-2xl hover:shadow-agro-500/40 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <div className="absolute inset-0 rounded-full bg-agro-400 animate-ping opacity-20 group-hover:opacity-30" />
            <Mic className="w-8 h-8 text-white mb-0.5" />
          </button>
          <p className="text-sm font-semibold text-gray-600">ðŸŽ™ï¸ Record Audio Note</p>
          <p className="text-xs text-gray-400">Tap the mic to start recording</p>
        </div>
      )}
    </div>
  );
}

// ===== CREATE POST FORM =====
function CreatePostForm({ onAddPost }) {
  const [text, setText] = useState('');
  const [showRecorder, setShowRecorder] = useState(false);

  const handleTextPost = async () => {
    if (!text.trim()) return;

    try {
      const response = await fetch(`${API_URL}/api/kilombo`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          author:      'Kwame Asante',
          location:    'Accra, Ghana',
          avatar:      'KA',
          avatarColor: 'from-agro-500 to-agro-700',
          text:        text.trim(),
          type:        'text',
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to post');

      // Add the saved post (with real DB id) to the feed
      onAddPost(data.post);
      setText('');
    } catch (err) {
      console.error('Error posting to Kilombo:', err);
      // Fallback: still show locally so the user isn't confused
      onAddPost({
        id:          `post_${Date.now()}`,
        author:      'Kwame Asante',
        location:    'Accra, Ghana',
        avatar:      'KA',
        avatarColor: 'from-agro-500 to-agro-700',
        timestamp:   'Just now',
        text:        text.trim(),
        type:        'text',
        likes:       0,
        replies:     0,
        liked:       false,
      });
      setText('');
    }
  };

  const handleAudioPost = async (duration) => {
    try {
      const response = await fetch(`${API_URL}/api/kilombo`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          author:        'Kwame Asante',
          location:      'Accra, Ghana',
          avatar:        'KA',
          avatarColor:   'from-agro-500 to-agro-700',
          text:          'Shared an audio note from the field 🎙️',
          type:          'audio',
          audioDuration: duration,
          audioLabel:    'My field recording',
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to post audio');

      onAddPost(data.post);
    } catch (err) {
      console.error('Error posting audio to Kilombo:', err);
      // Fallback: still show locally
      onAddPost({
        id:            `post_${Date.now()}`,
        author:        'Kwame Asante',
        location:      'Accra, Ghana',
        avatar:        'KA',
        avatarColor:   'from-agro-500 to-agro-700',
        timestamp:     'Just now',
        text:          'Shared an audio note from the field 🎙️',
        type:          'audio',
        audioDuration: duration,
        audioLabel:    'My field recording',
        likes:         0,
        replies:       0,
        liked:         false,
      });
    }
    setShowRecorder(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-sm">
      <h3 className="text-sm font-display font-bold text-gray-800 mb-4 flex items-center gap-2">
        <MessageCircle className="w-4 h-4 text-agro-500" /> Share with the community
      </h3>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        placeholder="What's happening on your farm today? Share a tip, ask a question..."
        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-800 placeholder-gray-400 text-sm focus:border-agro-400 focus:ring-4 focus:ring-agro-100 outline-none resize-none transition-all duration-200 mb-4"
      />

      {showRecorder && (
        <div className="mb-4">
          <AudioRecorder onPost={handleAudioPost} />
        </div>
      )}

      <div className="flex items-center gap-3 flex-wrap">
        <button
          id="toggle-recorder-btn"
          onClick={() => setShowRecorder(!showRecorder)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${
            showRecorder
              ? 'border-red-300 bg-red-50 text-red-600'
              : 'border-agro-200 bg-agro-50 text-agro-700 hover:border-agro-300 hover:bg-agro-100'
          }`}
        >
          {showRecorder ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          {showRecorder ? 'Hide Recorder' : 'ðŸŽ™ï¸ Record Audio Note'}
        </button>

        <button
          id="submit-post-btn"
          onClick={handleTextPost}
          disabled={!text.trim()}
          className="ml-auto flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-agro-600 to-agro-500 text-white text-sm font-bold rounded-xl shadow-md shadow-agro-500/20 hover:shadow-lg hover:shadow-agro-500/30 active:scale-[0.98] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
          Post
        </button>
      </div>
    </div>
  );
}

// ===== MICRO-LEARNING SIDEBAR =====
function MicroLearningSidebar({ onUnlockGAP, gapUnlocked }) {
  const [justUnlocked, setJustUnlocked] = useState(false);

  const handleGAP = () => {
    if (gapUnlocked) return;
    setJustUnlocked(true);
    onUnlockGAP();
    setTimeout(() => setJustUnlocked(false), 3000);
  };

  return (
    <div className="space-y-5">
      {/* Micro-Learning Header */}
      <div className="bg-gradient-to-br from-agro-600 to-agro-700 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-5 h-5" />
          <h3 className="font-display font-bold">Micro-Learning</h3>
        </div>
        <p className="text-xs text-agro-100 leading-relaxed">
          Complete short modules and earn badges that appear directly on your profile.
        </p>
      </div>

      {/* GAP Module */}
      <div className={`bg-white rounded-2xl border-2 p-5 shadow-sm transition-all duration-500 ${
        gapUnlocked ? 'border-agro-300 bg-agro-50/30' : 'border-gray-100'
      }`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${
            gapUnlocked ? 'bg-agro-500' : 'bg-agro-100'
          }`}>
            <Leaf className={`w-6 h-6 transition-colors duration-500 ${
              gapUnlocked ? 'text-white' : 'text-agro-600'
            }`} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Module 1</p>
            <h4 className="text-sm font-display font-bold text-gray-900">Good Agricultural Practices</h4>
          </div>
        </div>

        <p className="text-xs text-gray-500 leading-relaxed mb-4">
          Learn internationally recognized GAP standards for food safety, environmental protection, and worker welfare.
        </p>

        <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
          <Clock className="w-3.5 h-3.5" />
          <span>~15 min</span>
          <span className="text-gray-200">â€¢</span>
          <Award className="w-3.5 h-3.5" />
          <span>1 badge</span>
        </div>

        {gapUnlocked ? (
          <div className="flex items-center gap-2 px-4 py-3 bg-agro-100 rounded-xl border border-agro-200">
            <CheckCircle className="w-5 h-5 text-agro-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-agro-800">Completed! ðŸŽ‰</p>
              <p className="text-xs text-agro-600">GAP Certified badge added to your profile</p>
            </div>
          </div>
        ) : (
          <button
            id="unlock-gap-btn"
            onClick={handleGAP}
            className="w-full py-3 bg-gradient-to-r from-agro-600 to-agro-500 text-white text-sm font-bold rounded-xl shadow-md shadow-agro-500/20 hover:shadow-lg hover:shadow-agro-500/30 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Good Agricultural Practices (GAP)
          </button>
        )}

        {justUnlocked && (
          <div className="mt-3 p-3 bg-agro-600 rounded-xl text-white text-xs text-center font-semibold animate-bounce">
            ðŸ… GAP Certified badge added to your Profile!
          </div>
        )}
      </div>

      {/* More modules (locked) */}
      {[
        { icon: 'ðŸŒŠ', title: 'Irrigation Management', duration: '20 min' },
        { icon: 'ðŸŸ', title: 'Aquaculture Basics', duration: '25 min' },
        { icon: 'ðŸŒ±', title: 'Organic Farming 101', duration: '18 min' },
      ].map((mod) => (
        <div key={mod.title} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm opacity-60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-xl">
              {mod.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-700 truncate">{mod.title}</p>
              <p className="text-xs text-gray-400">{mod.duration} Â· Coming soon</p>
            </div>
            <div className="w-5 h-5 rounded-full border-2 border-gray-200 flex-shrink-0" />
          </div>
        </div>
      ))}

      {/* Community Stats */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Community</h3>
        <div className="space-y-3">
          {[
            { label: 'Active Farmers', value: '4,218', icon: Users, color: 'text-agro-600 bg-agro-50' },
            { label: 'Posts Today', value: '183', icon: MessageCircle, color: 'text-earth-600 bg-earth-50' },
            { label: 'Countries', value: '28', icon: MapPin, color: 'text-soil-600 bg-soil-50' },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-400">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


// ===== MAIN KILOMBO PAGE =====
export default function KilomboPage({ onUnlockGAPBadge, gapBadgeUnlocked, currentUser, onLogout }) {
  const [posts, setPosts]         = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError]   = useState(null);

  // Load all forum posts from the backend on page open
  useEffect(() => {
    async function loadPosts() {
      try {
        const res  = await fetch(`${API_URL}/api/kilombo`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load posts');
        setPosts(data.posts);
        setApiError(null);
      } catch (err) {
        console.error('Failed to fetch Kilombo posts:', err);
        setApiError('Backend not connected. Showing local data only.');
        // Fallback to seed data so the page is not blank when offline
        setPosts(SEED_POSTS);
      } finally {
        setIsLoading(false);
      }
    }
    loadPosts();
  }, []);

  const handleAddPost = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar currentUser={currentUser} onLogout={onLogout} />

      {/* Page Header */}
      <section className="relative pt-28 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-agro-950 via-agro-800 to-agro-600" />
        <div className="absolute inset-0 bg-dots opacity-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-5 border border-white/20">
              <Radio className="w-4 h-4 text-agro-300 animate-pulse" />
              <span className="text-sm font-medium text-agro-100">Live Community</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-white mb-4">
              The Kilombo 🌍
            </h1>
            <p className="text-lg text-agro-200 leading-relaxed max-w-xl">
              A gathering place for African farmers to share knowledge, voice notes, and field updates.
              Your village, your voice.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* API error banner */}
          {apiError && (
            <div className="flex items-center gap-3 p-4 mb-6 bg-amber-50 border-2 border-amber-200 rounded-xl text-amber-800">
              <WifiOff className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{apiError}</p>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">

            {/* Feed Column */}
            <div className="lg:col-span-2 space-y-5">
              {/* Create Post */}
              <CreatePostForm onAddPost={handleAddPost} />

              {/* Post Feed */}
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                  <div className="w-10 h-10 border-4 border-agro-200 border-t-agro-600 rounded-full animate-spin mb-3" />
                  <p className="text-sm font-medium">Loading community posts...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div>
              <MicroLearningSidebar
                onUnlockGAP={onUnlockGAPBadge}
                gapUnlocked={gapBadgeUnlocked}
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
