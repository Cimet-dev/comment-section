import { useState } from 'react';

// Maximum nesting level for replies. 0 = top-level comment, 1 = reply, 2 = reply to a reply
const MAX_DEPTH = 4;

const CURRENT_USER = { author: 'You', initials: 'JD', tone: 'blue' };

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

function createComment(text) {
  return {
    ...CURRENT_USER,
    id: createId(),
    time: 'Just now',
    text,
    likes: 0,
    liked: false,
    replies: [],
  };
}

// Every comment has the same shape, including its own `replies` array.
const starterComments = [
  {
    id: 1,
    author: 'Maya Chen',
    initials: 'MC',
    tone: 'lavender',
    time: '10:24 AM',
    text: 'The welcome screen feels much calmer now. I wonder if we can make the first step feel a little more inviting, though. It’s the moment where someone decides whether to keep going.',
    likes: 3,
    liked: false,
    replies: [
      {
        id: 2,
        author: 'Alex Lee',
        initials: 'AL',
        tone: 'coral',
        time: '10:31 AM',
        text: 'Yes. A small, specific example under the headline could do the trick without adding another step.',
        likes: 1,
        liked: false,
        replies: [
          {
            id: 6,
            author: 'Maya Chen',
            initials: 'MC',
            tone: 'lavender',
            time: '10:35 AM',
            text: 'Something like “Set up your first project in under two minutes”?',
            likes: 0,
            liked: false,
            replies: [],
          },
        ],
      },
      {
        id: 3,
        author: 'Jordan Rivera',
        initials: 'JR',
        tone: 'sage',
        time: '10:38 AM',
        text: 'I like that. We have a couple of real customer quotes that could work here.',
        likes: 0,
        liked: false,
        replies: [],
      },
    ],
  },
  {
    id: 4,
    author: 'Alex Lee',
    initials: 'AL',
    tone: 'coral',
    time: '10:46 AM',
    text: 'One tiny thing: the back button changes position between steps. Keeping it anchored would make the whole flow feel more considered.',
    likes: 2,
    liked: false,
    replies: [],
  },
  {
    id: 5,
    author: 'You',
    initials: 'JD',
    tone: 'blue',
    time: '11:02 AM',
    text: 'Good catch. I’ll keep the navigation fixed and bring the quote idea into the next pass.',
    likes: 1,
    liked: true,
    replies: [],
  },
];

/* ---------- Presentational components (no logic to change here) ---------- */

function Avatar({ initials, tone, small = false }) {
  return (
    <span className={`avatar avatar-${tone}${small ? ' avatar-small' : ''}`} aria-hidden="true">
      {initials}
    </span>
  );
}

function ReplyComposer({ id, replyToName, onSubmit, onCancel }) {
  const [draft, setDraft] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    onSubmit(text);
    setDraft('');
  }

  return (
    <form className="reply-composer" onSubmit={handleSubmit}>
      <Avatar initials={CURRENT_USER.initials} tone={CURRENT_USER.tone} small />
      <label className="sr-only" htmlFor={`reply-${id}`}>Write a reply</label>
      <input
        autoFocus
        id={`reply-${id}`}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => event.key === 'Escape' && onCancel()}
        placeholder={`Reply to ${replyToName}...`}
      />
      <button className="send-button" type="submit" disabled={!draft.trim()}>Send</button>
    </form>
  );
}

// Renders one comment: avatar, meta, text and action buttons.
// Pass `onReplyClick` to show the Reply button; omit it to hide the button.
// Anything passed as `children` renders under the actions.
function CommentBody({ comment, small = false, onLikeClick, onReplyClick, children }) {
  return (
    <div className={small ? 'reply-row' : 'comment-row'}>
      <Avatar initials={comment.initials} tone={comment.tone} small={small} />
      <div className="comment-content">
        <div className="comment-meta">
          <span className="author-name">{comment.author}</span>
          {comment.author === CURRENT_USER.author && <span className="you-label">YOU</span>}
          <time>{comment.time}</time>
        </div>
        <p className="comment-text">{comment.text}</p>
        <div className="comment-actions">
          <button
            className={`action-button${comment.liked ? ' is-liked' : ''}`}
            type="button"
            aria-pressed={comment.liked}
            onClick={onLikeClick}
          >
            <span aria-hidden="true">♡</span> {comment.likes > 0 ? comment.likes : 'Like'}
          </button>
          {onReplyClick && (
            <button className="action-button" type="button" onClick={onReplyClick}>
              Reply
            </button>
          )}
          {comment.replies.length > 0 && (
            <span className="reply-count">
              {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
            </span>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}

/* ---------- Comment section (currently supports one level of replies) ---------- */

function CommentSection() {
  const [comments, setComments] = useState(starterComments);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);

  const commentCount = comments.reduce((count, comment) => count + 1 + comment.replies.length, 0);

  function addComment(event) {
    event.preventDefault();
    const text = newComment.trim();
    if (!text) return;
    setComments((current) => [...current, createComment(text)]);
    setNewComment('');
  }

  function addReply(commentId, text) {
    setComments((current) => current.map((comment) => (
      comment.id === commentId
        ? { ...comment, replies: [...comment.replies, createComment(text)] }
        : comment
    )));
    setReplyingTo(null);
  }

  function toggleLike(commentId, replyId) {
    setComments((current) => current.map((comment) => {
      if (comment.id !== commentId) return comment;

      if (replyId === undefined) {
        const liked = !comment.liked;
        return { ...comment, liked, likes: comment.likes + (liked ? 1 : -1) };
      }

      return {
        ...comment,
        replies: comment.replies.map((reply) => {
          if (reply.id !== replyId) return reply;
          const liked = !reply.liked;
          return { ...reply, liked, likes: reply.likes + (liked ? 1 : -1) };
        }),
      };
    }));
  }

  return (
    <section className="comment-section" aria-label="Comments">
      <div className="comments-toolbar">
        <h2>Conversation <span>{commentCount}</span></h2>
      </div>

      <div className="comment-list">
        {comments.map((comment) => (
          <article className="comment-thread" key={comment.id}>
            <CommentBody
              comment={comment}
              onLikeClick={() => toggleLike(comment.id)}
              onReplyClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
            >
              {replyingTo === comment.id && (
                <ReplyComposer
                  id={comment.id}
                  replyToName={comment.author}
                  onSubmit={(text) => addReply(comment.id, text)}
                  onCancel={() => setReplyingTo(null)}
                />
              )}
            </CommentBody>

            {comment.replies.length > 0 && (
              <div className="reply-list" aria-label={`Replies to ${comment.author}`}>
                {comment.replies.map((reply) => (
                  <CommentBody
                    key={reply.id}
                    comment={reply}
                    small
                    onLikeClick={() => toggleLike(comment.id, reply.id)}
                  />
                ))}
              </div>
            )}
          </article>
        ))}
      </div>

      <form className="new-comment" onSubmit={addComment}>
        <Avatar initials={CURRENT_USER.initials} tone={CURRENT_USER.tone} />
        <label className="sr-only" htmlFor="new-comment">Add to the conversation</label>
        <div className="new-comment-field">
          <textarea
            id="new-comment"
            value={newComment}
            onChange={(event) => setNewComment(event.target.value)}
            placeholder="Add to the conversation..."
            rows="2"
          />
          <div className="composer-footer">
            <span>Be kind. Keep it constructive.</span>
            <button className="post-button" type="submit" disabled={!newComment.trim()}>
              Post comment <span aria-hidden="true">↗</span>
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}

export default CommentSection;