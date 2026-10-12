/* ============ 扣好人生第一粒扣子 · 课件逻辑 ============ */

/* ---------- 1. 翻页导航 ---------- */
const slides = Array.from(document.querySelectorAll('.slide'));
let cur = 0;

const progressEl = document.getElementById('progress');
const counterEl = document.getElementById('counter');
const dotsEl = document.getElementById('dots');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

function renderNav() {
  progressEl.style.width = ((cur + 1) / slides.length * 100) + '%';
  counterEl.textContent = (cur + 1) + ' / ' + slides.length;
  slides.forEach((s, i) => s.classList.toggle('active', i === cur));
  prevBtn.disabled = cur === 0;
  nextBtn.disabled = cur === slides.length - 1;
  Array.from(dotsEl.children).forEach((d, i) => d.classList.toggle('cur', i === cur));
  if (window.__menuItems) window.__menuItems.forEach((m, i) => m.classList.toggle('cur', i === cur));
}

function go(i) {
  cur = Math.max(0, Math.min(slides.length - 1, i));
  renderNav();
}
function next() { go(cur + 1); }
function prev() { go(cur - 1); }

nextBtn.addEventListener('click', next);
prevBtn.addEventListener('click', prev);

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); next(); }
  else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); prev(); }
  else if (e.key === 'Home') go(0);
  else if (e.key === 'End') go(slides.length - 1);
});

// 底部圆点导航
slides.forEach((s, i) => {
  const d = document.createElement('button');
  d.className = 'dot';
  d.textContent = i + 1;
  d.title = s.querySelector('h2') ? s.querySelector('h2').textContent : '第 ' + (i + 1) + ' 页';
  d.addEventListener('click', () => go(i));
  dotsEl.appendChild(d);
});

/* ---------- 1.5 目录菜单 ---------- */
const menuBtn = document.getElementById('menuBtn');
const menuOverlay = document.getElementById('menuOverlay');
const menuClose = document.getElementById('menuClose');
const menuList = document.getElementById('menuList');

const menuGroups = [
  { title: '🚀 开场', labels: ['封面', '导入 · 为什么是扣扣子'] },
  { title: '📚 知识点 · 十颗扣子', labels: ['第1扣 好习惯', '第2扣 核心价值观', '第3扣 时间管理', '第4扣 目标管理', '第5扣 诚信', '第6扣 责任', '第7扣 感恩', '第8扣 自律', '第9扣 安全', '第10扣 礼仪'] },
  { title: '🎮 游戏 · 12个', labels: ['游戏1 扣扣子大作战', '游戏2 知识抢答', '游戏3 好习惯连连看', '游戏4 时间四象限', '游戏5 价值观拼图', '游戏6 记忆翻牌', '游戏7 幸运大转盘', '游戏8 你说我猜', '游戏9 情景剧表演', '游戏10 判断题闯关', '游戏11 选择题擂台', '游戏12 宣誓接龙'] },
  { title: '🎯 结尾', labels: ['总结 · 立flag · 宣誓'] },
];

let menuIdx = 0;
menuGroups.forEach(g => {
  const group = document.createElement('div');
  group.className = 'menu-group';
  const t = document.createElement('div');
  t.className = 'menu-group-title';
  t.textContent = g.title;
  group.appendChild(t);
  const grid = document.createElement('div');
  grid.className = 'menu-grid';
  g.labels.forEach(label => {
    const item = document.createElement('button');
    item.className = 'menu-item';
    item.textContent = label;
    const idx = menuIdx++;
    item.addEventListener('click', () => { go(idx); closeMenu(); });
    grid.appendChild(item);
  });
  group.appendChild(grid);
  menuList.appendChild(group);
});
window.__menuItems = Array.from(menuList.querySelectorAll('.menu-item'));

function openMenu() { menuOverlay.classList.add('open'); }
function closeMenu() { menuOverlay.classList.remove('open'); }
menuBtn.addEventListener('click', openMenu);
menuClose.addEventListener('click', closeMenu);
menuOverlay.addEventListener('click', (e) => { if (e.target === menuOverlay) closeMenu(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

/* ---------- 2. 40 分钟倒计时 ---------- */
const timerEl = document.getElementById('timer');
const timerBtn = document.getElementById('timerBtn');
let total = 40 * 60;
let left = total;
let timerInt = null;
let running = false;

function fmt(s) {
  const m = Math.floor(s / 60), ss = s % 60;
  return String(m).padStart(2, '0') + ':' + String(ss).padStart(2, '0');
}
function tick() {
  left--;
  if (left <= 0) { left = 0; stopTimer(); }
  timerEl.textContent = fmt(left);
  if (left <= 300) timerEl.classList.add('warn');
  else timerEl.classList.remove('warn');
}
function startTimer() {
  if (running || left <= 0) return;
  running = true; timerBtn.textContent = '⏸';
  timerInt = setInterval(tick, 1000);
}
function stopTimer() {
  running = false; clearInterval(timerInt); timerBtn.textContent = '▶';
}
function resetTimer() {
  stopTimer(); left = total; timerEl.textContent = fmt(left); timerEl.classList.remove('warn');
}
timerBtn.addEventListener('click', () => running ? stopTimer() : startTimer());
timerBtn.addEventListener('dblclick', resetTimer);

/* ---------- 3. 游戏数据 ---------- */

// 抢答（游戏2）
const buzzData = [
  { q: '24 字核心价值观里，「诚信」属于哪个层面？', a: '个人层面' },
  { q: '养成一个好习惯一般需要多少天？', a: '21 天' },
  { q: '番茄工作法的专注时间是多久？', a: '25 分钟' },
  { q: '「人无信不立」是古代哪位名人说的？', a: '孔子' },
  { q: '「第一粒扣子」比喻的是什么？', a: '青少年时期养成的价值观、习惯和品格' },
  { q: '时间四象限里，「制定复习计划」属于哪一类？', a: '重要但不紧急' },
  { q: '「播下一个行动，收获一种习惯」这句话是谁说的？', a: '培根' },
  { q: '说出一句常用的文明用语。', a: '请 / 谢谢 / 对不起 / 没关系（任一）' },
];

// 判断题（游戏10）
const tfData = [
  { q: '第一粒扣子扣错了，后面的扣子也会跟着错。', a: true },
  { q: '好习惯只需要一天就能养成。', a: false, why: '养成一个好习惯一般需要 21 天。' },
  { q: '社会主义核心价值观一共有 12 个词、24 个字。', a: true },
  { q: '遇到不会的题，抄同学的作业是聪明的做法。', a: false, why: '抄袭是不诚信的表现，应该独立思考或请教老师。' },
  { q: '上课前把手机交给老师保管，是自律的表现。', a: true },
  { q: '时间四象限中，重要且紧急的事情应该最后再做。', a: false, why: '重要且紧急的事应该优先处理。' },
  { q: '诚信就是说到做到、不撒谎。', a: true },
  { q: '只要学习好，其他方面都不重要。', a: false, why: '德智体美劳要全面发展，品格比分数更重要。' },
  { q: '每天阅读 20 分钟是一个好习惯。', a: true },
  { q: '遇到挫折就放弃，是坚强的表现。', a: false, why: '面对挫折不放弃、迎难而上才是坚强。' },
];

// 选择题（游戏11）
const mcqData = [
  { q: '「扣好人生第一粒扣子」强调的是什么时期？', opts: ['A. 老年', 'B. 青少年', 'C. 中年', 'D. 幼儿'], a: 1 },
  { q: '养成一个好习惯一般需要多少天？', opts: ['A. 1 天', 'B. 7 天', 'C. 21 天', 'D. 100 天'], a: 2 },
  { q: '下列哪个不属于社会主义核心价值观「个人层面」？', opts: ['A. 爱国', 'B. 敬业', 'C. 自由', 'D. 诚信'], a: 2, why: '自由属于社会层面。' },
  { q: '下列哪个是好习惯？', opts: ['A. 熬夜刷手机', 'B. 课前预习', 'C. 抄作业', 'D. 乱扔垃圾'], a: 1 },
  { q: '番茄工作法的专注时间一般是多久？', opts: ['A. 15 分钟', 'B. 25 分钟', 'C. 50 分钟', 'D. 2 小时'], a: 1 },
  { q: 'SMART 原则中的 S 代表什么？', opts: ['A. 具体 Specific', 'B. 时间 Time', 'C. 成功 Success', 'D. 速度 Speed'], a: 0 },
  { q: '下列哪个属于「重要但不紧急」的事？', opts: ['A. 明天要交的作业', 'B. 锻炼身体', 'C. 刷短视频', 'D. 接推销电话'], a: 1 },
  { q: '「诚信」的反义词是？', opts: ['A. 善良', 'B. 欺骗', 'C. 勇敢', 'D. 勤劳'], a: 1 },
  { q: '发现同学有困难，我们应该？', opts: ['A. 嘲笑', 'B. 视而不见', 'C. 主动帮助', 'D. 躲开'], a: 2 },
  { q: '合理使用手机，应该？', opts: ['A. 通宵玩游戏', 'B. 定时限时使用', 'C. 上课偷偷玩', 'D. 走路看手机'], a: 1 },
];

// 你说我猜（游戏8）
const charadeWords = [
  '早睡早起', '诚信', '自律', '感恩', '坚持', '文明', '节约用水',
  '专注', '责任', '勤奋', '友善', '时间管理', '礼貌', '晨跑', '读书',
];

// 情景剧（游戏9）
const roleplayScenes = [
  '同桌考试时想抄你的答案，你会怎么做？请 3 人分角色演出来。',
  '你在操场捡到一个钱包，里面有 100 元，你会怎么做？',
  '同学在背后说老师的坏话，你刚好路过听到了。',
  '妈妈辛苦做了一桌饭，你却只顾着打游戏，请演出妈妈的辛苦和你的改变。',
  '好朋友约你逃课去网吧，你怎么办？',
  '有人把垃圾随手扔在地上，你上前提醒，对方态度不好。',
];

// 习惯接龙（游戏12）
const chainHabits = [
  '今天回家，主动跟爸爸妈妈说一句「辛苦了」',
  '今天睡前，把手机放到客厅充电，早睡 10 分钟',
  '今天课间，主动向 3 位同学问好',
  '今天放学前，把书桌和抽屉整理干净',
  '今天阅读课外书 20 分钟',
  '今天做一件帮助同学的小事',
  '今天节约用水，洗完手关紧水龙头',
  '今天见到老师，主动问声好',
];

/* ---------- 4. 游戏1：扣扣子大作战 ---------- */
function initButtonGame() {
  const box = document.getElementById('btnBox');
  const status = document.getElementById('btnStatus');
  box.innerHTML = '';
  let startT = null;
  const btns = [];
  for (let i = 0; i < 12; i++) {
    const b = document.createElement('button');
    b.className = 'btn-item';
    b.textContent = '○';
    b.done = false;
    b.addEventListener('click', () => {
      if (!startT) startT = Date.now();
      if (b.done) return;
      b.done = true;
      b.classList.add('done');
      b.textContent = '✔';
      const leftCnt = btns.filter(x => !x.done).length;
      if (leftCnt === 0) {
        const t = ((Date.now() - startT) / 1000).toFixed(1);
        status.innerHTML = '🎉 全部扣好！用时 <b>' + t + '</b> 秒，再来一局？';
      } else {
        status.textContent = '加油！还剩 ' + leftCnt + ' 颗扣子';
      }
    });
    btns.push(b);
    box.appendChild(b);
  }
  status.textContent = '点击扣子，全部扣好，比谁快！';
}

/* ---------- 5. 答题引擎（抢答/判断/选择） ---------- */
function renderQuiz(bodyId, data, mode) {
  const body = document.getElementById(bodyId);
  body.innerHTML = '';
  let score = 0, answered = 0;

  const scoreEl = document.createElement('div');
  scoreEl.className = 'quiz-score';
  scoreEl.textContent = mode === 'buzz' ? '' : ('得分：0 / ' + data.length);
  if (mode !== 'buzz') body.appendChild(scoreEl);

  data.forEach((item, idx) => {
    const box = document.createElement('div');
    box.className = 'quiz-q';
    box.innerHTML = '<div class="q-text">' + (idx + 1) + '. ' + item.q + '</div>';
    const ans = document.createElement('div');
    ans.className = 'q-answer';
    box.appendChild(ans);

    if (mode === 'buzz') {
      const btn = document.createElement('button');
      btn.className = 'reveal-btn';
      btn.textContent = '💡 揭晓答案';
      btn.addEventListener('click', () => {
        ans.textContent = '✔ 答案：' + item.a;
        box.classList.add('show');
      });
      box.appendChild(btn);
    } else if (mode === 'tf') {
      const row = document.createElement('div');
      ['对 ✔', '错 ✘'].forEach((t, i) => {
        const b = document.createElement('button');
        b.className = 'opt-btn';
        b.textContent = t;
        b.addEventListener('click', () => {
          if (box.dataset.done) return;
          box.dataset.done = '1';
          const correct = (item.a === true && i === 0) || (item.a === false && i === 1);
          if (correct) { b.classList.add('right'); score++; }
          else { b.classList.add('wrong'); }
          ans.textContent = (correct ? '✅ 答对！' : '❌ 答错！') + (item.why ? ' ' + item.why : '');
          answered++;
          box.classList.add('show');
          scoreEl.textContent = '得分：' + score + ' / ' + data.length + (answered === data.length ? '  🎉 完成！' : '');
        });
        row.appendChild(b);
      });
      box.appendChild(row);
    } else if (mode === 'mcq') {
      item.opts.forEach((opt, oi) => {
        const b = document.createElement('button');
        b.className = 'opt-btn';
        b.textContent = opt;
        b.addEventListener('click', () => {
          if (box.dataset.done) return;
          box.dataset.done = '1';
          if (oi === item.a) { b.classList.add('right'); score++; }
          else { b.classList.add('wrong'); box.querySelectorAll('.opt-btn')[item.a].classList.add('right'); }
          ans.textContent = (oi === item.a ? '✅ 答对！' : '❌ 正确答案是 ' + item.opts[item.a]) + (item.why ? '（' + item.why + '）' : '');
          answered++;
          box.classList.add('show');
          scoreEl.textContent = '得分：' + score + ' / ' + data.length + (answered === data.length ? '  🎉 完成！' : '');
        });
        box.appendChild(b);
      });
    }
    body.appendChild(box);
  });
}

/* ---------- 6. 游戏3：好习惯连连看 ---------- */
const matchPairs = [
  ['早睡早起', '精力充沛'],
  ['课前预习', '上课高效'],
  ['坚持运动', '身体强壮'],
  ['主动问好', '文明有礼'],
  ['诚实守信', '值得信任'],
  ['整理书桌', '做事高效'],
];
function initMatchGame() {
  const board = document.getElementById('matchBoard');
  const msg = document.getElementById('matchMsg');
  board.innerHTML = '';
  const leftCol = document.createElement('div');
  const rightCol = document.createElement('div');
  leftCol.className = 'match-col';
  rightCol.className = 'match-col';

  const leftItems = matchPairs.map(p => p[0]);
  const rightItems = matchPairs.map(p => p[1]).sort(() => Math.random() - 0.5);
  let sel = null;
  let done = 0;

  leftItems.forEach(t => {
    const el = document.createElement('div');
    el.className = 'match-item';
    el.textContent = t;
    el.addEventListener('click', () => {
      if (el.classList.contains('ok')) return;
      leftCol.querySelectorAll('.sel').forEach(x => x.classList.remove('sel'));
      el.classList.add('sel');
      sel = el;
    });
    leftCol.appendChild(el);
  });

  rightItems.forEach(t => {
    const el = document.createElement('div');
    el.className = 'match-item';
    el.textContent = t;
    el.addEventListener('click', () => {
      if (el.classList.contains('ok')) return;
      if (!sel) { msg.textContent = '请先点击左边的一个「习惯」'; return; }
      const leftText = sel.textContent;
      const pair = matchPairs.find(p => p[0] === leftText);
      if (pair && pair[1] === t) {
        sel.classList.add('ok'); el.classList.add('ok');
        sel.classList.remove('sel'); sel = null;
        done++;
        msg.textContent = '✅ 配对成功！已完成 ' + done + ' / ' + matchPairs.length;
        if (done === matchPairs.length) msg.innerHTML = '🎉 全部配对完成，好习惯满分！';
      } else {
        el.classList.add('wrong');
        msg.textContent = '❌ 配错了，再想想！';
        setTimeout(() => el.classList.remove('wrong'), 450);
      }
    });
    rightCol.appendChild(el);
  });

  board.appendChild(leftCol);
  board.appendChild(rightCol);
  msg.textContent = '开始配对！';
}

/* ---------- 7. 游戏4：时间四象限 ---------- */
const quadrants = [
  { key: 'q1', title: '① 重要且紧急', tip: '立刻做', color: 'q1' },
  { key: 'q2', title: '② 重要不紧急', tip: '计划做', color: 'q2' },
  { key: 'q3', title: '③ 紧急不重要', tip: '可以拒绝/委托', color: 'q3' },
  { key: 'q4', title: '④ 不紧急不重要', tip: '少做', color: 'q4' },
];
const quadTasks = [
  { t: '明天要交的作文', a: 'q1' },
  { t: '下周期中考试，制定复习计划', a: 'q2' },
  { t: '推销电话突然打来', a: 'q3' },
  { t: '通宵刷短视频', a: 'q4' },
  { t: '每天坚持晨跑', a: 'q2' },
  { t: '老师突然找你去办公室', a: 'q1' },
  { t: '玩游戏打发时间', a: 'q4' },
  { t: '帮同学搬东西', a: 'q3' },
];
function initQuadrantGame() {
  const grid = document.getElementById('quadGrid');
  const pool = document.getElementById('quadPool');
  const msg = document.getElementById('quadMsg');
  grid.innerHTML = '';
  pool.innerHTML = '';

  const boxes = {};
  quadrants.forEach(q => {
    const box = document.createElement('div');
    box.className = 'quad-box ' + q.color;
    box.dataset.key = q.key;
    box.innerHTML = '<div class="q-title">' + q.title + '</div><div class="q-items"></div>';
    boxes[q.key] = box;
    grid.appendChild(box);
  });

  let sel = null, score = 0, total = quadTasks.length;
  quadTasks.forEach(task => {
    const el = document.createElement('div');
    el.className = 'pool-item';
    el.textContent = task.t;
    el.addEventListener('click', () => {
      if (el.classList.contains('done')) return;
      pool.querySelectorAll('.sel').forEach(x => x.classList.remove('sel'));
      el.classList.add('sel');
      sel = { el, task };
    });
    pool.appendChild(el);
  });

  Object.values(boxes).forEach(box => {
    box.addEventListener('click', () => {
      if (!sel) { msg.textContent = '请先选择下面的一个任务'; return; }
      const { el, task } = sel;
      const correct = box.dataset.key === task.a;
      if (correct) {
        el.classList.add('done'); el.classList.remove('sel');
        const chip = document.createElement('span');
        chip.className = 'quad-item';
        chip.textContent = task.t;
        box.querySelector('.q-items').appendChild(chip);
        score++;
      } else {
        box.classList.add('hover');
        setTimeout(() => box.classList.remove('hover'), 400);
      }
      sel = null;
      msg.innerHTML = '得分：' + score + ' / ' + total + (score === total ? ' 🎉 时间管理大师！' : (correct ? ' ✅ 正确！' : ' ❌ 再想想它该放哪？'));
    });
  });

  msg.textContent = '得分：0 / ' + total;
}

/* ---------- 8. 游戏5：价值观拼图 ---------- */
const puzzleWords = ['富强', '民主', '文明', '和谐', '自由', '平等', '公正', '法治', '爱国', '敬业', '诚信', '友善'];
function initPuzzleGame() {
  const target = document.getElementById('puzzleTarget');
  const tiles = document.getElementById('puzzleTiles');
  const msg = document.getElementById('puzzleMsg');
  target.innerHTML = '';
  tiles.innerHTML = '';
  let step = 0;

  const rows = [[], [], []];
  [['国家'], ['社会'], ['个人']].forEach((label, ri) => {
    const row = document.createElement('div');
    row.className = 'p-row';
    const lab = document.createElement('span');
    lab.className = 'v-label';
    lab.textContent = label[0];
    row.appendChild(lab);
    for (let i = 0; i < 4; i++) {
      const slot = document.createElement('div');
      slot.className = 'p-slot';
      slot.textContent = '·';
      rows[ri].push(slot);
      row.appendChild(slot);
    }
    target.appendChild(row);
  });

  const flatSlots = rows.flat();
  const shuffled = [...puzzleWords].sort(() => Math.random() - 0.5);
  shuffled.forEach(w => {
    const t = document.createElement('div');
    t.className = 'p-tile';
    t.textContent = w;
    t.addEventListener('click', () => {
      if (t.classList.contains('used')) return;
      if (w === puzzleWords[step]) {
        flatSlots[step].textContent = w;
        flatSlots[step].classList.add('filled');
        t.classList.add('used');
        step++;
        msg.textContent = step === puzzleWords.length ? '🎉 24 字核心价值观，完美拼出！' : '✅ 正确！继续，已填 ' + step + ' / 12';
      } else {
        t.classList.add('used');
        setTimeout(() => t.classList.remove('used'), 400);
        msg.textContent = '❌ 顺序不对哦，想想「国家 → 社会 → 个人」';
      }
    });
    tiles.appendChild(t);
  });
  msg.textContent = '从下面选词，按顺序填入上方！';
}

/* ---------- 9. 游戏6：记忆翻牌 ---------- */
const memoryPairs = [
  ['🏃', '锻炼'], ['📖', '阅读'], ['😴', '早睡'], ['🍎', '健康饮食'],
  ['📝', '复习'], ['🤝', '礼貌'], ['⏰', '守时'], ['💧', '节约'],
];
function initMemoryGame() {
  const grid = document.getElementById('memoryGrid');
  const msg = document.getElementById('memoryMsg');
  grid.innerHTML = '';
  let first = null, lock = false, matched = 0;

  const cards = memoryPairs.flatMap((p, i) => [
    { emoji: p[0], word: p[1], pair: i },
    { emoji: p[0], word: p[1], pair: i },
  ]).sort(() => Math.random() - 0.5);

  cards.forEach(c => {
    const card = document.createElement('div');
    card.className = 'mem-card';
    card.innerHTML = '<div class="face">?</div><div class="back">' + c.emoji + '</div>';
    card.dataset.pair = c.pair;
    card.addEventListener('click', () => {
      if (lock || card.classList.contains('flip') || card.classList.contains('matched')) return;
      card.classList.add('flip');
      if (!first) { first = card; return; }
      lock = true;
      if (first.dataset.pair === card.dataset.pair) {
        first.classList.add('matched'); card.classList.add('matched');
        first = null; lock = false; matched++;
        msg.textContent = '✅ 配对成功！还差 ' + (memoryPairs.length - matched) + ' 对';
        if (matched === memoryPairs.length) msg.innerHTML = '🎉 全部找齐！好习惯满分！';
      } else {
        msg.textContent = '❌ 不一样，再记记位置！';
        setTimeout(() => { first.classList.remove('flip'); card.classList.remove('flip'); first = null; lock = false; }, 800);
      }
    });
    grid.appendChild(card);
  });
  msg.textContent = '翻开卡片，寻找相同的好习惯。';
}

/* ---------- 10. 游戏7：幸运大转盘 ---------- */
const wheelItems = [
  '说一个好习惯', '表演一个坏习惯', '全班为你鼓掌', '讲一个诚信小故事',
  '小组 +1 分', '模仿老师的口头禅', '对同桌说谢谢', '背出 24 字',
  '做 5 个深蹲', '唱一句歌', '喊一句励志口号', '免答一次',
];
const wheelColors = ['#ff6ec4', '#ff9a3d', '#ffd166', '#6ee7b7', '#7ee8fa', '#4facfe', '#b78cff', '#f472b6', '#fb923c', '#a3e635', '#38bdf8', '#f87171'];
function initWheelGame() {
  const wheel = document.getElementById('wheel');
  const result = document.getElementById('wheelResult');
  const btn = document.getElementById('wheelSpin');
  wheel.innerHTML = '';

  const n = wheelItems.length;
  const seg = 360 / n;
  const R = 120; // 文字到圆心的距离

  let grad = wheelColors.map((c, i) => c + ' ' + (i * seg) + 'deg ' + ((i + 1) * seg) + 'deg').join(', ');
  wheel.style.background = 'conic-gradient(' + grad + ')';

  const labels = wheelItems.map((item) => {
    const el = document.createElement('div');
    el.className = 'wheel-label';
    el.textContent = item;
    wheel.appendChild(el);
    return el;
  });

  let rotation = 0;
  let spinning = false;

  function place(rot) {
    // 每段文字放在自己的角度，同时反向旋转，让文字始终保持"正着"可读
    labels.forEach((el, i) => {
      const ang = rot + i * seg + seg / 2;
      el.style.transform = 'translate(-50%, -50%) rotate(' + ang + 'deg) translateY(-' + R + 'px) rotate(' + (-ang) + 'deg)';
    });
  }

  wheel.style.transform = 'rotate(0deg)';
  place(0);

  btn.addEventListener('click', () => {
    if (spinning) return;
    spinning = true;
    result.textContent = '转动中……';
    const start = rotation;
    const extra = 360 * 5 + Math.random() * 360;
    const dur = 4000;
    const t0 = performance.now();

    function step(now) {
      let t = (now - t0) / dur;
      if (t > 1) t = 1;
      const e = 1 - Math.pow(1 - t, 3); // ease-out 缓出
      rotation = start + extra * e;
      wheel.style.transform = 'rotate(' + rotation + 'deg)';
      place(rotation);
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        spinning = false;
        const idx = Math.floor(((360 - (rotation % 360)) % 360) / seg);
        result.innerHTML = '🎯 抽中了：<b>' + wheelItems[idx] + '</b>';
      }
    }
    requestAnimationFrame(step);
  });

  result.textContent = '点击按钮开始！';
}

/* ---------- 11. 游戏8：你说我猜 ---------- */
function initCharadeGame() {
  const wordEl = document.getElementById('charadeWord');
  const timerEl = document.getElementById('charadeTimer');
  const btn = document.getElementById('charadeBtn');
  const goBtn = document.getElementById('charadeGo');
  let int = null, sec = 30;

  btn.addEventListener('click', () => {
    clearInterval(int); sec = 30; timerEl.textContent = '30'; timerEl.classList.remove('warn');
    wordEl.textContent = charadeWords[Math.floor(Math.random() * charadeWords.length)];
  });
  goBtn.addEventListener('click', () => {
    clearInterval(int); sec = 30; timerEl.textContent = '30'; timerEl.classList.remove('warn');
    int = setInterval(() => {
      sec--;
      timerEl.textContent = sec;
      if (sec <= 5) timerEl.classList.add('warn');
      if (sec <= 0) { clearInterval(int); timerEl.textContent = '0'; timerEl.classList.remove('warn'); }
    }, 1000);
  });
}

/* ---------- 12. 游戏9：情景剧 ---------- */
function initRoleplayGame() {
  const card = document.getElementById('roleplayCard');
  const btn = document.getElementById('roleplayBtn');
  btn.addEventListener('click', () => {
    card.textContent = '🎬 ' + roleplayScenes[Math.floor(Math.random() * roleplayScenes.length)];
  });
}

/* ---------- 13. 游戏12：习惯接龙 & 宣誓 ---------- */
function initChainGame() {
  const promptEl = document.getElementById('chainPrompt');
  const btn = document.getElementById('chainBtn');
  btn.addEventListener('click', () => {
    promptEl.textContent = '🌟 ' + chainHabits[Math.floor(Math.random() * chainHabits.length)];
  });
}

/* ---------- 14. 启动（防御式：先显示页面，再初始化游戏） ---------- */
// 任何未捕获的错误都显示在屏幕左下角，方便排查
window.addEventListener('error', (e) => {
  const el = document.createElement('div');
  el.style.cssText = 'position:fixed;bottom:8px;left:8px;z-index:9999;background:rgba(200,40,40,.92);color:#fff;padding:8px 14px;border-radius:8px;font-size:13px;max-width:85%;font-family:monospace;';
  el.textContent = '⚠️ 出错：' + (e.message || '未知错误');
  document.body.appendChild(el);
});

renderNav(); // 先让第一页显示出来

function safeInit(fn, name) {
  try { fn(); } catch (err) { console.error('[' + name + '] 初始化失败：', err); }
}
safeInit(initButtonGame, '扣扣子');
safeInit(() => renderQuiz('buzzBody', buzzData, 'buzz'), '抢答');
safeInit(initMatchGame, '连连看');
safeInit(initQuadrantGame, '四象限');
safeInit(initPuzzleGame, '拼图');
safeInit(initMemoryGame, '翻牌');
safeInit(initWheelGame, '转盘');
safeInit(initCharadeGame, '你说我猜');
safeInit(initRoleplayGame, '情景剧');
safeInit(() => renderQuiz('tfBody', tfData, 'tf'), '判断题');
safeInit(() => renderQuiz('mcqBody', mcqData, 'mcq'), '选择题');
safeInit(initChainGame, '宣誓');
