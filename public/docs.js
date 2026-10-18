// Hyde docs: mobile menu, "On this page" with the current section marked,
// heading anchors and copy buttons on code blocks.
(() => {
  const article = document.querySelector('.article');
  if (!article) return;

  // Mobile menu
  const menuButton = document.querySelector('.menu-button');
  menuButton?.addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  document.querySelectorAll('.sidebar a').forEach((a) =>
    a.addEventListener('click', () => {
      document.body.classList.remove('menu-open');
      menuButton?.setAttribute('aria-expanded', 'false');
    }),
  );

  // Headings: stable ids + anchor links
  const slug = (text) =>
    text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, '-')
      .replace(/^-+|-+$/g, '');
  const used = new Set([...document.querySelectorAll('[id]')].map((el) => el.id));
  const headings = [...article.querySelectorAll('h2, h3')];
  for (const h of headings) {
    if (!h.id) {
      let id = slug(h.textContent) || 'section';
      let n = 2;
      while (used.has(id)) id = `${slug(h.textContent)}-${n++}`;
      h.id = id;
      used.add(id);
    }
    const a = document.createElement('a');
    a.className = 'anchor';
    a.href = `#${h.id}`;
    a.setAttribute('aria-label', `Link to ${h.textContent}`);
    a.textContent = '#';
    h.append(a);
  }

  // On this page
  const toc = document.querySelector('.toc ul');
  if (toc && headings.length > 1) {
    for (const h of headings) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#${h.id}`;
      a.textContent = h.firstChild.textContent.trim();
      if (h.tagName === 'H3') a.className = 'sub';
      li.append(a);
      toc.append(li);
    }
    const links = new Map([...toc.querySelectorAll('a')].map((a) => [a.hash.slice(1), a]));
    let current;
    const mark = () => {
      const offset = 120;
      let active = headings[0];
      for (const h of headings) {
        if (h.getBoundingClientRect().top - offset <= 0) active = h;
        else break;
      }
      if (active === current) return;
      links.get(current?.id)?.classList.remove('active');
      links.get(active.id)?.classList.add('active');
      current = active;
    };
    document.addEventListener('scroll', mark, { passive: true });
    mark();
  } else {
    document.querySelector('.toc')?.remove();
  }

  // Copy buttons
  for (const block of article.querySelectorAll('.code')) {
    const pre = block.querySelector('pre');
    if (!pre || !navigator.clipboard) continue;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'copy';
    button.textContent = 'Copy';
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(pre.innerText.trimEnd());
        button.textContent = 'Copied';
        button.dataset.done = '';
      } catch {
        button.textContent = 'Press Ctrl+C';
      }
      setTimeout(() => {
        button.textContent = 'Copy';
        delete button.dataset.done;
      }, 1600);
    });
    block.append(button);
  }
})();
