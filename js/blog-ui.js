/**
 * blog-ui.js
 * Blog card builder for SparkShield — light industrial theme.
 * Brown accent (#8B5E3C), Bebas Neue + Barlow Condensed + Barlow fonts.
 *
 * FIX: Cards no longer use the global .rv class (which needs an external
 * IntersectionObserver to add .on). Instead they use a self-contained
 * CSS keyframe animation so they are always visible immediately.
 */

/* ══════════════════════════════════════════
   CARD BUILDERS
══════════════════════════════════════════ */

function buildBlogCard(blog, featured) {
  featured = !!featured;
  var imageUrl = getBlogImageUrl(blog.featured_image);
  var hasImage = !!imageUrl;
  var date = formatDate(blog.created_at);
  var timeToRead = readingTime(blog.content);
  var raw = blog.meta_description || '';
  var excerpt = raw.length > 130 ? raw.slice(0, 130) + '…' : raw;

  return (
    '<article class="bl-card' + (featured ? ' bl-card--featured' : '') + '" role="article">' +

      '<a href="blog-details.html?slug=' + encodeURIComponent(blog.slug) + '"' +
         ' class="bl-img" aria-label="Read ' + blog.title + '">' +

        (hasImage
          ? '<img src="' + imageUrl + '" alt="' + blog.title + '" loading="lazy">'
          : '<div class="bl-img-placeholder" aria-hidden="true">' +
              '<svg viewBox="0 0 60 40" fill="none" width="60" height="40">' +
                '<path d="M5 35 L20 15 L30 25 L42 10 L55 35Z" fill="rgba(139,94,60,0.15)"/>' +
                '<circle cx="15" cy="12" r="5" fill="rgba(139,94,60,0.10)"/>' +
              '</svg>' +
            '</div>') +

        '<div class="bl-img-ov"></div>' +
        '<span class="bl-tag">' + (blog.category || 'Welding Safety') + '</span>' +
      '</a>' +

      '<div class="bl-body">' +
        '<a href="blog-details.html?slug=' + encodeURIComponent(blog.slug) + '" class="bl-t">' +
          blog.title +
        '</a>' +

        (excerpt ? '<div class="bl-ex">' + excerpt + '</div>' : '') +

        '<a href="blog-details.html?slug=' + encodeURIComponent(blog.slug) + '"' +
           ' class="bl-lnk" aria-label="Read full article: ' + blog.title + '">' +
          'Read More' +
          '<svg width="12" height="12" viewBox="0 0 24 24"' +
              ' stroke="currentColor" fill="none"' +
              ' stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M5 12h14M12 5l7 7-7 7"/>' +
          '</svg>' +
        '</a>' +
      '</div>' +

      '<div class="bl-foot">' +
        '<svg width="13" height="13" viewBox="0 0 24 24"' +
            ' stroke="currentColor" fill="none"' +
            ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
          '<circle cx="12" cy="12" r="10"/>' +
          '<polyline points="12 6 12 12 16 14"/>' +
        '</svg>' +
        timeToRead +
        '<span class="bl-dot"></span>' +
        '<span class="bl-date">' + date + '</span>' +
      '</div>' +

    '</article>'
  );
}

function buildBlogSkeletons(count) {
  count = count || 3;
  var out = '';
  for (var i = 0; i < count; i++) {
    out += (
      '<div class="bl-card bl-card--skeleton" aria-hidden="true">' +
        '<div class="bl-img skel-img"></div>' +
        '<div class="bl-body" style="gap:12px">' +
          '<div class="skel-line" style="width:90%;height:22px"></div>' +
          '<div class="skel-line skel-line--md"></div>' +
          '<div class="skel-line skel-line--sm"></div>' +
        '</div>' +
        '<div class="bl-foot" style="border-top:1px solid var(--border,#E0D9CF)">' +
          '<div class="skel-line skel-line--sm" style="width:80px;margin:0"></div>' +
        '</div>' +
      '</div>'
    );
  }
  return out;
}

function buildEmptyState(message) {
  message = message || 'No articles yet. Check back soon!';
  return (
    '<div class="blog-empty-state" role="status">' +
      '<svg viewBox="0 0 64 64" fill="none" width="56" height="56">' +
        '<rect x="8" y="16" width="48" height="36" rx="2"' +
              ' stroke="var(--accent,#8B5E3C)" stroke-width="1.5"/>' +
        '<path d="M16 28h32M16 36h20"' +
              ' stroke="var(--accent,#8B5E3C)" stroke-width="1.5" stroke-linecap="round"/>' +
      '</svg>' +
      '<p>' + message + '</p>' +
    '</div>'
  );
}

function buildErrorState(message) {
  message = message || 'Failed to load articles. Please try again.';
  return (
    '<div class="blog-error-state" role="alert">' +
      '<svg viewBox="0 0 64 64" fill="none" width="56" height="56">' +
        '<circle cx="32" cy="32" r="24"' +
                ' stroke="var(--accent,#8B5E3C)" stroke-width="1.5"/>' +
        '<path d="M32 20v16M32 44v2"' +
              ' stroke="var(--accent,#8B5E3C)" stroke-width="2" stroke-linecap="round"/>' +
      '</svg>' +
      '<p>' + message + '</p>' +
      '<button class="btn-retry" onclick="location.reload()">Try Again</button>' +
    '</div>'
  );
}

function setPageMeta(title, description) {
  if (title) {
    document.title = title;
    var ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);
  }
  if (description) {
    var metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);
    var ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);
  }
}

/* kept for compatibility — pages that call this explicitly still work */
function triggerReveal() {
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e, i) {
      if (e.isIntersecting) {
        setTimeout(function() { e.target.classList.add('on'); }, i * 80);
      }
    });
  }, { threshold: 0.06 });
  document.querySelectorAll('.rv:not(.on)').forEach(function(el) { obs.observe(el); });
}


/* ══════════════════════════════════════════
   CSS — injected once into <head>
   Blog cards use their own @keyframes fadeUp
   so they NEVER depend on the global .rv/.on
   IntersectionObserver flow.
══════════════════════════════════════════ */
(function injectBlogStyles() {
  if (document.getElementById('ss-blog-ui-styles')) return;

  var style = document.createElement('style');
  style.id = 'ss-blog-ui-styles';
  style.textContent = '\
/* ── keyframe for card entry ── */\
@keyframes blCardIn{\
  from{opacity:0;transform:translateY(28px)}\
  to  {opacity:1;transform:translateY(0)}\
}\
\
/* ── grid ── */\
.bl-grid{\
  display:grid;\
  grid-template-columns:repeat(3,1fr);\
  gap:20px;\
  margin-top:64px;\
}\
\
/* ── card shell ── */\
/* NOTE: NO opacity:0 here — cards are always visible */\
.bl-card{\
  background:var(--surface,#fff);\
  border:1px solid var(--border,#E0D9CF);\
  border-radius:2px;\
  overflow:hidden;\
  display:flex;\
  flex-direction:column;\
  position:relative;\
  /* animate in with own keyframe, not .rv/.on */\
  animation:blCardIn .55s ease both;\
  transition:\
    transform .4s cubic-bezier(.25,.46,.45,.94),\
    border-color .4s,\
    box-shadow .4s;\
}\
/* stagger the 3 cards */\
.bl-card:nth-child(1){animation-delay:.05s}\
.bl-card:nth-child(2){animation-delay:.15s}\
.bl-card:nth-child(3){animation-delay:.25s}\
\
/* top accent line */\
.bl-card::before{\
  content:"";\
  position:absolute;\
  top:0;left:0;right:0;\
  height:3px;\
  background:linear-gradient(90deg,transparent,var(--accent,#8B5E3C),transparent);\
  opacity:0;\
  transition:opacity .5s;\
  z-index:3;\
}\
.bl-card:hover::before{opacity:1}\
.bl-card:hover{\
  transform:translateY(-6px);\
  border-color:var(--border2,#CBBBA5);\
  box-shadow:0 24px 60px rgba(139,94,60,.15);\
}\
.bl-card--featured{\
  border-color:rgba(139,94,60,.22);\
  background:linear-gradient(160deg,rgba(139,94,60,.04) 0%,var(--surface,#fff) 60%);\
}\
\
/* ── image area ── */\
.bl-img{\
  display:block;\
  height:195px;\
  overflow:hidden;\
  position:relative;\
  flex-shrink:0;\
  text-decoration:none;\
  background:var(--surface2,#F2EEE9);\
}\
.bl-img img{\
  width:100%;height:100%;\
  object-fit:cover;\
  filter:brightness(.75) saturate(.88);\
  transition:transform .55s ease,filter .55s ease;\
}\
.bl-card:hover .bl-img img{\
  transform:scale(1.06);\
  filter:brightness(.86) saturate(1);\
}\
.bl-img-placeholder{\
  width:100%;height:100%;\
  display:flex;align-items:center;justify-content:center;\
}\
.bl-img-ov{\
  position:absolute;inset:0;\
  background:linear-gradient(135deg,rgba(139,94,60,.1),transparent);\
  transition:background .4s;\
  pointer-events:none;\
}\
.bl-card:hover .bl-img-ov{\
  background:linear-gradient(135deg,rgba(139,94,60,.22),transparent);\
}\
.bl-tag{\
  position:absolute;\
  bottom:12px;left:14px;\
  font-family:"Barlow Condensed",sans-serif;\
  font-size:9px;font-weight:700;\
  letter-spacing:3px;text-transform:uppercase;\
  color:#fff;\
  background:var(--accent,#8B5E3C);\
  padding:4px 10px;\
  border-radius:2px;\
  pointer-events:none;\
  z-index:2;\
}\
\
/* ── body ── */\
.bl-body{\
  padding:22px 20px 18px;\
  flex:1;\
  display:flex;\
  flex-direction:column;\
  gap:10px;\
}\
.bl-t{\
  font-family:"Bebas Neue",sans-serif;\
  font-size:21px;\
  letter-spacing:1px;\
  line-height:1.1;\
  color:var(--text,#1A1A1A);\
  text-decoration:none;\
  display:block;\
  transition:color .2s;\
}\
.bl-t:hover{color:var(--accent,#8B5E3C)}\
.bl-ex{\
  font-family:"Barlow",sans-serif;\
  font-size:12.5px;\
  color:var(--muted,#6F6B66);\
  line-height:1.78;\
  flex:1;\
}\
.bl-lnk{\
  display:inline-flex;\
  align-items:center;\
  gap:6px;\
  font-family:"Barlow Condensed",sans-serif;\
  font-size:10px;font-weight:700;\
  letter-spacing:2.5px;text-transform:uppercase;\
  color:var(--accent,#8B5E3C);\
  text-decoration:none;\
  transition:gap .3s,color .2s;\
  margin-top:auto;\
  width:fit-content;\
}\
.bl-lnk:hover{gap:12px;color:var(--fire,#E8620A)}\
.bl-lnk svg{flex-shrink:0;transition:transform .3s}\
.bl-lnk:hover svg{transform:translateX(2px)}\
\
/* ── footer meta bar ── */\
.bl-foot{\
  display:flex;\
  align-items:center;\
  gap:7px;\
  padding:11px 20px;\
  border-top:1px solid var(--border,#E0D9CF);\
  font-family:"Barlow Condensed",sans-serif;\
  font-size:11px;font-weight:600;\
  letter-spacing:.5px;\
  color:var(--muted2,#9A948C);\
}\
.bl-foot svg{flex-shrink:0;opacity:.6}\
.bl-dot{\
  width:3px;height:3px;\
  border-radius:50%;\
  background:var(--border2,#CBBBA5);\
  flex-shrink:0;\
}\
.bl-date{margin-left:auto}\
\
/* ── skeleton loader ── */\
.bl-card--skeleton{\
  pointer-events:none;\
  /* override the entry animation for skeletons */\
  animation:none;\
  opacity:1;\
}\
.skel-img{\
  height:195px;\
  background:linear-gradient(90deg,\
    var(--surface2,#F2EEE9) 25%,\
    var(--surface3,#EAE4DD) 50%,\
    var(--surface2,#F2EEE9) 75%);\
  background-size:200% 100%;\
  animation:skelShimmer 1.6s infinite;\
}\
.skel-line{\
  height:14px;border-radius:2px;\
  background:linear-gradient(90deg,\
    var(--surface2,#F2EEE9) 25%,\
    var(--surface3,#EAE4DD) 50%,\
    var(--surface2,#F2EEE9) 75%);\
  background-size:200% 100%;\
  animation:skelShimmer 1.6s infinite;\
  margin-bottom:10px;\
}\
.skel-line--md{width:70%}\
.skel-line--sm{width:45%}\
@keyframes skelShimmer{\
  0%  {background-position:200% 0}\
  100%{background-position:-200% 0}\
}\
\
/* ── empty / error states ── */\
.blog-empty-state,\
.blog-error-state{\
  grid-column:1/-1;\
  display:flex;flex-direction:column;\
  align-items:center;gap:16px;\
  padding:64px 24px;text-align:center;\
  font-family:"Barlow Condensed",sans-serif;\
  font-size:13px;letter-spacing:1px;\
  color:var(--muted,#6F6B66);\
}\
.btn-retry{\
  background:var(--accent,#8B5E3C);\
  color:#fff;border:none;border-radius:2px;\
  padding:10px 24px;\
  font-family:"Barlow Condensed",sans-serif;\
  font-size:10px;font-weight:700;\
  letter-spacing:2.5px;text-transform:uppercase;\
  cursor:pointer;\
  transition:background .3s,transform .2s;\
}\
.btn-retry:hover{background:var(--fire,#E8620A);transform:translateY(-2px)}\
\
/* ── responsive ── */\
@media(max-width:1024px){.bl-grid{grid-template-columns:1fr 1fr}}\
@media(max-width:640px) {.bl-grid{grid-template-columns:1fr}}\
';

  document.head.appendChild(style);
})();


/* ══════════════════════════════════════════
   SELF-INITIALISING BLOG LOADER
══════════════════════════════════════════ */
(function initHomepageBlog() {

  function loadBlogs() {
    var grid = document.getElementById('ss-blog-grid');
    if (!grid) return;

    if (typeof fetchBlogs !== 'function') {
      console.error(
        '[SparkShield Blog] fetchBlogs() not found.\n' +
        'Ensure blog-config.js loads BEFORE blog-ui.js.'
      );
      grid.innerHTML = buildErrorState('Configuration error — contact the developer.');
      return;
    }

    // Show shimmer skeletons right away
    grid.innerHTML = buildBlogSkeletons(3);

    console.log('[SparkShield Blog] Fetching posts…');

    fetchBlogs({ limit: 3 })
      .then(function(blogs) {
        console.log('[SparkShield Blog] Received ' + (blogs ? blogs.length : 0) + ' posts:', blogs);

        if (!blogs || blogs.length === 0) {
          console.warn(
            '[SparkShield Blog] 0 rows returned.\n' +
            'Fix checklist:\n' +
            '  1. Supabase → blogs table → confirm "website" column = "sparkshield"\n' +
            '  2. Supabase → Authentication → Policies → blogs table → add SELECT for anon\n' +
            '  3. Run in DevTools: fetchBlogs({limit:3}).then(console.log)'
          );
          grid.innerHTML = buildEmptyState();
          return;
        }

        // Render cards — they animate in via @keyframes blCardIn, no .rv/.on needed
        grid.innerHTML = blogs.map(function(b) {
          return buildBlogCard(b);
        }).join('');
      })
      .catch(function(err) {
        console.error('[SparkShield Blog] Fetch error:', err);
        grid.innerHTML = buildErrorState();
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadBlogs);
  } else {
    loadBlogs();
  }

})();