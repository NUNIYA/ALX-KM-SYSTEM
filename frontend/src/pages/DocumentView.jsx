import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import DOMPurify from 'dompurify';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Heart, Bookmark, MessageSquare, Eye, Download, 
  Clock, Tag, User, Globe, ThumbsUp, Send, Star, ChevronDown,
  History, FileText, Shield, Trash2
} from 'lucide-react';

const DocumentView = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [doc, setDoc] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentBody, setCommentBody] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [showVersionHistory, setShowVersionHistory] = useState(false);

  const fetchDoc = async () => {
    try {
      const res = await axios.get(`'+(import.meta.env.VITE_API_URL || 'http://localhost:5001')+'/api/resources/${id}`);
      setDoc(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(`'+(import.meta.env.VITE_API_URL || 'http://localhost:5001')+'/api/comments?targetType=resource&targetId=${id}`);
      setComments(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchDoc();
    fetchComments();
  }, [id]);

  const handleLike = async () => {
    try {
      const res = await axios.patch(`'+(import.meta.env.VITE_API_URL || 'http://localhost:5001')+'/api/resources/${id}/like`);
      setDoc(res.data);
    } catch (err) { console.error(err); }
  };

  const handleBookmark = async () => {
    try {
      const res = await axios.patch(`'+(import.meta.env.VITE_API_URL || 'http://localhost:5001')+'/api/resources/${id}/bookmark`);
      setDoc(res.data);
    } catch (err) { console.error(err); }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentBody.trim()) return;
    try {
      await axios.post(''+(import.meta.env.VITE_API_URL || 'http://localhost:5001')+'/api/comments', {
        body: commentBody,
        targetType: 'resource',
        targetId: id,
        parentCommentId: replyTo || null
      });
      setCommentBody('');
      setReplyTo(null);
      fetchComments();
    } catch (err) { console.error(err); }
  };

  const handleMarkBestAnswer = async (commentId) => {
    try {
      await axios.patch(`'+(import.meta.env.VITE_API_URL || 'http://localhost:5001')+'/api/comments/${commentId}/best-answer`, {
        targetType: 'resource', targetId: id
      });
      fetchComments();
    } catch (err) { console.error(err); }
  };

  const handleUpvoteComment = async (commentId) => {
    try {
      await axios.patch(`'+(import.meta.env.VITE_API_URL || 'http://localhost:5001')+'/api/comments/${commentId}/upvote`);
      fetchComments();
    } catch (err) { console.error(err); }
  };

  const isLiked = doc?.likes?.includes(user?._id);
  const isBookmarked = doc?.bookmarks?.includes(user?._id);

  if (loading) return (
    <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#050505]' : 'bg-[#F9FAFB]'}`}>
      <div className="animate-pulse text-primary text-[11px] font-black uppercase tracking-[0.5em]">Loading Document...</div>
    </div>
  );

  if (!doc) return (
    <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#050505]' : 'bg-[#F9FAFB]'}`}>
      <div className="text-center">
        <FileText className="w-16 h-16 mx-auto mb-4 text-slate-300" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">Document not found or access restricted.</p>
        <Link to="/repository" className="mt-6 inline-block text-primary font-bold text-[10px] uppercase tracking-widest hover:underline">← Back to Repository</Link>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen pb-40 transition-colors duration-700 ${isDark ? 'bg-[#050505]' : 'bg-[#F9FAFB]'}`}>
      
      {/* Document Header */}
      <section className={`pt-36 pb-16 px-12 border-b ${isDark ? 'bg-[#0A0A0B] border-white/5' : 'bg-white border-slate-100'}`}>
        <div className="max-w-[1200px] mx-auto">
          <Link to="/repository" className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-10 hover:text-black transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Repository
          </Link>

          {/* Metadata badges */}
          <div className="flex flex-wrap gap-3 mb-8">
            <span className="px-4 py-1.5 bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest rounded-full border border-primary/20">{doc.category}</span>
            {doc.track && doc.track !== 'All' && <span className="px-4 py-1.5 bg-blue-500/10 text-blue-500 text-[9px] font-black uppercase tracking-widest rounded-full border border-blue-500/20">{doc.track}</span>}
            {doc.region && doc.region !== 'All' && <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase tracking-widest rounded-full border border-emerald-500/20">{doc.region}</span>}
            <span className="px-4 py-1.5 bg-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-widest rounded-full">v{doc.version || 1}</span>
          </div>

          <h1 className={`text-5xl md:text-6xl font-black uppercase tracking-tight leading-none mb-8 ${isDark ? 'text-white' : 'text-black'}`}>
            {doc.title}
          </h1>

          <div className="flex flex-wrap items-center gap-8 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            <span className="flex items-center"><User className="w-4 h-4 mr-2 text-primary" />{doc.uploadedBy}</span>
            <span className="flex items-center"><Clock className="w-4 h-4 mr-2" />{new Date(doc.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <span className="flex items-center"><Eye className="w-4 h-4 mr-2" />{doc.viewCount || 0} Views</span>
            <span className="flex items-center"><Heart className="w-4 h-4 mr-2" />{doc.likes?.length || 0} Likes</span>
            <span className="flex items-center"><MessageSquare className="w-4 h-4 mr-2" />{comments.length} Comments</span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-10">
            <button onClick={handleLike} className={`flex items-center px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${isLiked ? 'bg-primary text-white border-primary' : isDark ? 'border-white/10 text-white hover:border-primary hover:text-primary' : 'border-slate-200 text-black hover:border-primary hover:text-primary'}`}>
              <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} /> {isLiked ? 'Liked' : 'Like'}
            </button>
            <button onClick={handleBookmark} className={`flex items-center px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${isBookmarked ? 'bg-blue-500 text-white border-blue-500' : isDark ? 'border-white/10 text-white hover:border-blue-500 hover:text-blue-500' : 'border-slate-200 text-black hover:border-blue-500 hover:text-blue-500'}`}>
              <Bookmark className="w-4 h-4 mr-2" /> {isBookmarked ? 'Saved' : 'Bookmark'}
            </button>
            {doc.fileUrl && (
              <a href={`'+(import.meta.env.VITE_API_URL || 'http://localhost:5001')+'/${doc.fileUrl}`} download className={`flex items-center px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${isDark ? 'border-white/10 text-white hover:border-emerald-500 hover:text-emerald-500' : 'border-slate-200 text-black hover:border-emerald-500 hover:text-emerald-500'}`}>
                <Download className="w-4 h-4 mr-2" /> Download
              </a>
            )}
            {doc.versionHistory?.length > 0 && (
              <button onClick={() => setShowVersionHistory(!showVersionHistory)} className={`flex items-center px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${isDark ? 'border-white/10 text-white hover:border-amber-500 hover:text-amber-500' : 'border-slate-200 text-black hover:border-amber-500 hover:text-amber-500'}`}>
                <History className="w-4 h-4 mr-2" /> Version History ({doc.versionHistory.length})
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-12 mt-12 grid grid-cols-1 lg:grid-cols-4 gap-12">
        
        {/* Main Document Content */}
        <article className="col-span-1 lg:col-span-3 space-y-12">

          {/* Description */}
          {doc.description && (
            <div className={`p-8 rounded-[2rem] border-l-4 border-primary ${isDark ? 'bg-[#0A0A0B] border-white/5' : 'bg-primary/5 border-slate-100'}`}>
              <p className={`text-base leading-relaxed font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{doc.description}</p>
            </div>
          )}

          {/* Rich Content Body */}
          {doc.content && (
            <div className={`p-10 rounded-[2rem] border shadow-sm ${isDark ? 'bg-[#0A0A0B] border-white/5' : 'bg-white border-slate-100'}`}>
              <div 
                className={`prose max-w-none ${isDark ? 'prose-invert' : ''}`}
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(doc.content) }}
              />
            </div>
          )}

          {/* Tags */}
          {doc.tags?.length > 0 && (
            <div className="flex flex-wrap gap-3">
              <Tag className="w-4 h-4 text-slate-400 mt-1" />
              {doc.tags.map(tag => (
                <span key={tag} className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-full ${isDark ? 'bg-white/5 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Version History Drawer */}
          <AnimatePresence>
            {showVersionHistory && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`rounded-[2rem] border overflow-hidden ${isDark ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-50 border-amber-200'}`}
              >
                <div className="p-8">
                  <h3 className="text-lg font-black uppercase tracking-tight text-amber-600 mb-6 flex items-center">
                    <History className="w-5 h-5 mr-3" /> Edit History
                  </h3>
                  <div className="space-y-4">
                    {doc.versionHistory.map((v, i) => (
                      <div key={i} className={`p-4 rounded-xl border ${isDark ? 'bg-black border-white/5' : 'bg-white border-amber-100'}`}>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase tracking-widest text-amber-600">Version {v.version}</span>
                          <span className="text-[9px] text-slate-500">{new Date(v.editedAt).toLocaleDateString()}</span>
                        </div>
                        <p className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Edited by {v.editedBy}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Comment Thread */}
          <div>
            <h3 className={`text-2xl font-black uppercase tracking-tight mb-8 flex items-center ${isDark ? 'text-white' : 'text-black'}`}>
              <MessageSquare className="w-6 h-6 mr-4 text-primary" /> Discussion ({comments.length})
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleComment} className={`p-6 rounded-[2rem] border mb-8 ${isDark ? 'bg-[#0A0A0B] border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
              {replyTo && (
                <div className="flex items-center justify-between mb-4 px-4 py-2 bg-primary/10 rounded-xl">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Replying to a comment</span>
                  <button type="button" onClick={() => setReplyTo(null)} className="text-slate-400 hover:text-red-500">×</button>
                </div>
              )}
              <textarea
                value={commentBody}
                onChange={e => setCommentBody(e.target.value)}
                placeholder={replyTo ? "Write your reply..." : "Share your thoughts or ask a question..."}
                rows={3}
                className={`w-full px-6 py-4 rounded-2xl border outline-none resize-none font-medium text-sm transition-all ${isDark ? 'bg-white/5 border-white/10 text-white focus:border-primary placeholder-slate-600' : 'bg-slate-50 border-slate-100 text-black focus:border-primary placeholder-slate-300'}`}
              />
              <div className="flex justify-end mt-4">
                <button type="submit" className="flex items-center px-8 py-3 bg-primary text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-black transition-all">
                  <Send className="w-4 h-4 mr-2" /> Post Comment
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
              {comments.map(comment => (
                <div key={comment._id} className={`p-8 rounded-[2rem] border transition-all ${comment.isBestAnswer ? (isDark ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200') : (isDark ? 'bg-[#0A0A0B] border-white/5' : 'bg-white border-slate-100 shadow-sm')}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <span className={`text-sm font-black uppercase tracking-tight mr-3 ${isDark ? 'text-white' : 'text-black'}`}>{comment.authorName}</span>
                        <span className={`text-[8px] px-2 py-1 rounded-full font-bold uppercase tracking-wide ${comment.authorRole === 'facilitator' ? 'bg-amber-500/10 text-amber-600' : comment.authorRole === 'admin' ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'}`}>{comment.authorRole}</span>
                      </div>
                    </div>
                    {comment.isBestAnswer && (
                      <span className="flex items-center text-[9px] font-black text-emerald-600 uppercase tracking-widest">
                        <Star className="w-4 h-4 mr-1 fill-current" /> Best Answer
                      </span>
                    )}
                  </div>
                  <p className={`text-sm leading-relaxed mb-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{comment.body}</p>
                  <div className="flex items-center gap-4">
                    <button onClick={() => handleUpvoteComment(comment._id)} className={`flex items-center text-[10px] font-bold uppercase tracking-widest transition-colors ${comment.upvotes?.includes(user?._id) ? 'text-primary' : isDark ? 'text-slate-500 hover:text-primary' : 'text-slate-400 hover:text-primary'}`}>
                      <ThumbsUp className="w-3 h-3 mr-1" /> {comment.upvotes?.length || 0}
                    </button>
                    <button onClick={() => setReplyTo(comment._id)} className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${isDark ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-black'}`}>
                      Reply
                    </button>
                    {['facilitator','admin'].includes(user?.role) && !comment.isBestAnswer && (
                      <button onClick={() => handleMarkBestAnswer(comment._id)} className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 hover:text-emerald-700 transition-colors flex items-center">
                        <Star className="w-3 h-3 mr-1" /> Mark Best Answer
                      </button>
                    )}
                  </div>

                  {/* Nested Replies */}
                  {comment.replies?.length > 0 && (
                    <div className="mt-6 ml-8 space-y-4 border-l-2 border-primary/20 pl-6">
                      {comment.replies.map(reply => (
                        <div key={reply._id} className={`p-4 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                          <div className="flex items-center space-x-3 mb-2">
                            <span className={`text-[10px] font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>{reply.authorName}</span>
                            <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase ${reply.authorRole === 'facilitator' ? 'bg-amber-500/10 text-amber-600' : 'bg-primary/10 text-primary'}`}>{reply.authorRole}</span>
                          </div>
                          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{reply.body}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {comments.length === 0 && (
                <div className="py-16 text-center">
                  <MessageSquare className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-slate-700' : 'text-slate-200'}`} />
                  <p className={`text-[11px] font-bold uppercase tracking-[0.2em] ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>No discussion yet. Be the first to contribute!</p>
                </div>
              )}
            </div>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="col-span-1 space-y-8 lg:sticky lg:top-32 lg:self-start">
          <div className={`rounded-[2.5rem] p-8 border shadow-sm ${isDark ? 'bg-[#0A0A0B] border-white/5' : 'bg-white border-slate-100'}`}>
            <h4 className={`text-sm font-black uppercase tracking-widest mb-6 ${isDark ? 'text-white' : 'text-black'}`}>Document Info</h4>
            <div className="space-y-4">
              <div><span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block mb-1">Author</span><span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-black'}`}>{doc.uploadedBy}</span></div>
              <div><span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block mb-1">Language</span><span className={`text-sm font-bold flex items-center ${isDark ? 'text-white' : 'text-black'}`}><Globe className="w-3 h-3 mr-1" />{doc.language || 'English'}</span></div>
              <div><span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block mb-1">Visibility</span><span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest ${doc.visibility === 'public' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>{doc.visibility}</span></div>
              <div><span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block mb-1">Version</span><span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-black'}`}>v{doc.version || 1}</span></div>
            </div>
          </div>

          {doc.externalLink && (
            <a href={doc.externalLink} target="_blank" rel="noreferrer" className="flex items-center justify-center w-full py-4 bg-black text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-primary transition-all">
              <Globe className="w-4 h-4 mr-2" /> External Resource
            </a>
          )}

          {user?.role === 'facilitator' && doc.uploadedBy === user?.name && (
            <Link to={`/repository/${id}/edit`} className={`flex items-center justify-center w-full py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] border transition-all ${isDark ? 'border-white/10 text-white hover:border-amber-500 hover:text-amber-500' : 'border-slate-200 text-black hover:border-amber-500 hover:text-amber-500'}`}>
              Edit Document
            </Link>
          )}
        </aside>
      </div>
    </div>
  );
};

export default DocumentView;
