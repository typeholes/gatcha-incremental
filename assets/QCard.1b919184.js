import { a as computed, c as createComponent, h, b as hSlot, Z as useRouterLinkProps, aj as useRouterLink, r as ref, x as isKeyCode, t as stopAndPrevent, D as hUniqueSlot, g as getCurrentInstance, N as Notify, X as reactive, n as nextTick } from "./index.524ecbcb.js";
const useDarkProps = {
  dark: {
    type: Boolean,
    default: null
  }
};
function useDark(props, $q) {
  return computed(() => props.dark === null ? $q.dark.isActive : props.dark);
}
var QItemSection = createComponent({
  name: "QItemSection",
  props: {
    avatar: Boolean,
    thumbnail: Boolean,
    side: Boolean,
    top: Boolean,
    noWrap: Boolean
  },
  setup(props, { slots }) {
    const classes = computed(
      () => `q-item__section column q-item__section--${props.avatar === true || props.side === true || props.thumbnail === true ? "side" : "main"}` + (props.top === true ? " q-item__section--top justify-start" : " justify-center") + (props.avatar === true ? " q-item__section--avatar" : "") + (props.thumbnail === true ? " q-item__section--thumbnail" : "") + (props.noWrap === true ? " q-item__section--nowrap" : "")
    );
    return () => h("div", { class: classes.value }, hSlot(slots.default));
  }
});
var QItem = createComponent({
  name: "QItem",
  props: {
    ...useDarkProps,
    ...useRouterLinkProps,
    tag: {
      type: String,
      default: "div"
    },
    active: {
      type: Boolean,
      default: null
    },
    clickable: Boolean,
    dense: Boolean,
    insetLevel: Number,
    tabindex: [String, Number],
    focused: Boolean,
    manualFocus: Boolean
  },
  emits: ["click", "keyup"],
  setup(props, { slots, emit }) {
    const { proxy: { $q } } = getCurrentInstance();
    const isDark = useDark(props, $q);
    const { hasLink, linkAttrs, linkClass, linkTag, navigateOnClick } = useRouterLink();
    const rootRef = ref(null);
    const blurTargetRef = ref(null);
    const isActionable = computed(
      () => props.clickable === true || hasLink.value === true || props.tag === "label"
    );
    const isClickable = computed(
      () => props.disable !== true && isActionable.value === true
    );
    const classes = computed(
      () => "q-item q-item-type row no-wrap" + (props.dense === true ? " q-item--dense" : "") + (isDark.value === true ? " q-item--dark" : "") + (hasLink.value === true && props.active === null ? linkClass.value : props.active === true ? ` q-item--active${props.activeClass !== void 0 ? ` ${props.activeClass}` : ""}` : "") + (props.disable === true ? " disabled" : "") + (isClickable.value === true ? " q-item--clickable q-link cursor-pointer " + (props.manualFocus === true ? "q-manual-focusable" : "q-focusable q-hoverable") + (props.focused === true ? " q-manual-focusable--focused" : "") : "")
    );
    const style = computed(() => {
      if (props.insetLevel === void 0) {
        return null;
      }
      const dir = $q.lang.rtl === true ? "Right" : "Left";
      return {
        ["padding" + dir]: 16 + props.insetLevel * 56 + "px"
      };
    });
    function onClick(e) {
      if (isClickable.value === true) {
        if (blurTargetRef.value !== null) {
          if (e.qKeyEvent !== true && document.activeElement === rootRef.value) {
            blurTargetRef.value.focus();
          } else if (document.activeElement === blurTargetRef.value) {
            rootRef.value.focus();
          }
        }
        navigateOnClick(e);
      }
    }
    function onKeyup(e) {
      if (isClickable.value === true && isKeyCode(e, 13) === true) {
        stopAndPrevent(e);
        e.qKeyEvent = true;
        const evt = new MouseEvent("click", e);
        evt.qKeyEvent = true;
        rootRef.value.dispatchEvent(evt);
      }
      emit("keyup", e);
    }
    function getContent() {
      const child = hUniqueSlot(slots.default, []);
      isClickable.value === true && child.unshift(
        h("div", { class: "q-focus-helper", tabindex: -1, ref: blurTargetRef })
      );
      return child;
    }
    return () => {
      const data = {
        ref: rootRef,
        class: classes.value,
        style: style.value,
        role: "listitem",
        onClick,
        onKeyup
      };
      if (isClickable.value === true) {
        data.tabindex = props.tabindex || "0";
        Object.assign(data, linkAttrs.value);
      } else if (isActionable.value === true) {
        data["aria-disabled"] = "true";
      }
      return h(
        linkTag.value,
        data,
        getContent()
      );
    };
  }
});
const space = h("div", { class: "q-space" });
var QSpace = createComponent({
  name: "QSpace",
  setup() {
    return () => space;
  }
});
var QList = createComponent({
  name: "QList",
  props: {
    ...useDarkProps,
    bordered: Boolean,
    dense: Boolean,
    separator: Boolean,
    padding: Boolean,
    tag: {
      type: String,
      default: "div"
    }
  },
  setup(props, { slots }) {
    const vm = getCurrentInstance();
    const isDark = useDark(props, vm.proxy.$q);
    const classes = computed(
      () => "q-list" + (props.bordered === true ? " q-list--bordered" : "") + (props.dense === true ? " q-list--dense" : "") + (props.separator === true ? " q-list--separator" : "") + (isDark.value === true ? " q-list--dark" : "") + (props.padding === true ? " q-list--padding" : "")
    );
    return () => h(props.tag, { class: classes.value }, hSlot(slots.default));
  }
});
function power(base, multiplier, cnt) {
  if (cnt < 0) {
    return 0;
  }
  return base * multiplier ** cnt;
}
function ceil(n, digits = 2) {
  const mult = 10 ** digits;
  return Math.ceil(n * mult) / mult;
}
function tuple(args) {
  return args;
}
function sumOn(arr, toNumber) {
  return arr.map((x) => toNumber(x)).reduce((a, b) => a + b, 0);
}
function defined(x) {
  return typeof (x != null ? x : void 0) !== "undefined";
}
function TODO(msg) {
  Notify.create({
    message: "Not implemented: " + msg,
    type: "TODO"
  });
}
function RewardTable(rewards, defaultSize = 1, sizeMultiplierOnReset = 2) {
  const table = {
    defaultSize,
    sizeMultiplierOnReset,
    table: rewards.map((x) => [defaultSize, x]),
    received: Object.fromEntries(rewards.map((x, i) => [i, 0]))
  };
  return table;
}
function pickReward(from, chanceModifier = 1) {
  const totalSize = sumOn(from.table, ([x]) => x);
  let r = Math.random() * totalSize;
  for (const i in from.table) {
    const option = from.table[i];
    const [size, reward] = option;
    if (r < size) {
      if (size > 1) {
        option[0] = Math.max(1, option[0] - chanceModifier);
      }
      from.received[i]++;
      resetWhenAllOne(from);
      return reward;
    }
    r -= size;
  }
  throw "pickReward exhausted all rewards";
}
function resetWhenAllOne(rewardTable) {
  if (rewardTable.table.every(([x]) => x === 1)) {
    rewardTable.defaultSize *= rewardTable.sizeMultiplierOnReset;
    rewardTable.table.forEach((x) => x[0] = rewardTable.defaultSize);
  }
}
const CostValue = ["cost", "value"];
function Gatcha(name, costBase, costGrowth, valueBase, valueGrowth, tierMessages) {
  return {
    name,
    cost: { base: costBase, growth: costGrowth },
    value: { base: valueBase, growth: valueGrowth },
    tierMessages
  };
}
const GatchaNames = ["Prank", "Punk", "Scam", "Phishing"];
const gatchas = Object.fromEntries(
  tuple(
    [
      Gatcha("Prank", 1, 1.1, 1, 1.4, [
        "You've learned to hang up",
        "Just chillin and eating some jerky, boys",
        `Maybe don't answer "scam likely"`,
        "s/jerky/beasty cool now I've got some old school beats",
        "TBD"
      ]),
      Gatcha("Punk", 10, 1.03, 10, 1.15, ["TBD", "TBD", "TBD", "TBD", "TBD"]),
      Gatcha("Scam", 100, 1.12, 100, 1.18, ["TBD", "TBD", "TBD", "TBD", "TBD"]),
      Gatcha("Phishing", 1e3, 1.15, 1e3, 1.2, [
        "TBD",
        "TBD",
        "TBD",
        "TBD",
        "TBD"
      ])
    ].map((x) => [x.name, x])
  )
);
Gatcha.mkRewardTable = (bankruptcies) => {
  const cnt = Math.min(Math.max(1, bankruptcies), GatchaNames.length);
  const names = GatchaNames.slice(0, cnt);
  const rewards = names.map((name) => CostValue.map((type) => [name, type])).flat(1);
  return RewardTable(rewards);
};
function keyPath(t, a, b, c, d) {
  return defined(b) ? defined(c) ? defined(d) ? [a, b, c, d] : [a, b, c] : [a, b] : [a];
}
function deepGet(t, p) {
  const [a, b, c, d] = p;
  return defined(b) ? defined(c) ? defined(d) ? t[a][b][c][d] : t[a][b][c] : t[a][b] : t[a];
}
function deepSet(t, p, v) {
  const [a, b, c, d] = p;
  const [tgt, key] = defined(b) ? defined(c) ? defined(d) ? [t[a][b][c], d] : [t[a][b], c] : [t[a], b] : [t, a];
  tgt[key] = v;
}
const SaveKey = "gatha-fool";
const setters = {
  "+=": (a, b) => a + b,
  "-=": (a, b) => a - b,
  "*=": (a, b) => a * b,
  "/=": (a, b) => a / b
};
const initialDivisors = () => Object.fromEntries(tuple(GatchaNames.map((x) => [x, { cost: 1, value: 1 }])));
const initialMultipliers = () => Object.fromEntries(tuple(GatchaNames.map((x) => [x, { cost: 1, value: 1 }])));
const game = (() => {
  const ret = reactive({
    responses: Object.fromEntries(tuple(GatchaNames.map((x) => [x, 0]))),
    baseIncome: 1,
    worth: 0,
    bankruptcies: 0,
    divisors: initialDivisors(),
    tmpDivisors: initialDivisors(),
    multipliers: initialMultipliers(),
    crisis: {
      base: { cost: 1e3, value: 1 },
      scale: { cost: 1.5, value: 2 },
      cnt: 0,
      rewards: void 0,
      rewardCnt: 1
    },
    retirement: {
      base: { cost: 1e5, value: 1.5 },
      scale: { cost: 1.5, value: 1.5 },
      cnt: 0,
      rewards: void 0,
      rewardCnt: 1
    },
    gatchaRewards: Gatcha.mkRewardTable(1),
    gatchaRewardChanceModifier: 1,
    gatchaRewardChanceModifierScaling: 2,
    tutorialFlags: {
      SplashScreen: {
        conditionMet: true,
        shown: false
      },
      DummyTutorial: {
        conditionMet: false,
        shown: false
      }
    },
    currentTutorial: void 0
  });
  ret.retirement.rewardCnt = keyPath(ret, "retirement", "cnt");
  ret.crisis.rewards = crisisRewards(ret);
  ret.retirement.rewards = retirementRewards(ret);
  return ret;
})();
window.game = game;
function nextBuy(name) {
  var _a;
  const curr = game.responses[name];
  const next = (_a = tiers.find((n) => n > curr)) != null ? _a : false;
  if (!next) {
    return { amt: 0, cost: 0, maxed: true };
  }
  const diff = next - curr;
  let costDiff = 0;
  for (let i = 0; i < diff; i++) {
    costDiff += getScaledGatcha(name, "cost", curr + i);
  }
  return { amt: diff, cost: costDiff, maxed: false };
}
function getDivisor(name, type) {
  return game.divisors[name][type] * game.tmpDivisors[name][type];
}
function getScaledGatcha(name, type, _cnt = game.responses[name]) {
  const params = gatchas[name][type];
  const cnt = _cnt + (type === "value" ? -1 : 0);
  return power(params.base, params.growth, cnt) / getDivisor(name, type) * game.multipliers[name][type];
}
function affordable(name) {
  const cost = getScaledGatcha(name, "cost");
  return game.worth >= cost ? cost : 0;
}
function getIncome() {
  let income = game.baseIncome * power(game.crisis.base.value, game.crisis.scale.value, game.crisis.cnt);
  for (const name of GatchaNames) {
    income -= getScaledGatcha(name, "value");
  }
  return income;
}
function respond(name, next = false) {
  const { amt, cost } = next ? next : { amt: 1, cost: affordable(name) };
  if (cost) {
    const oldCnt = game.responses[name];
    const newCnt = game.responses[name] += amt;
    checkTiers(name, oldCnt, newCnt);
    game.worth -= cost;
  }
}
function resetGameValues() {
  game.worth = 0;
  for (const name of GatchaNames) {
    game.responses[name] = 0;
  }
  game.tmpDivisors = initialDivisors();
}
function resetTutorials() {
  for (const key in game.tutorialFlags) {
    const tutorial = key;
    game.tutorialFlags[tutorial] = { conditionMet: false, shown: false };
  }
}
function getBankruptcyValue(upToGatchaIdx = game.bankruptcies) {
  var _a;
  const worth = game.worth >= 0 ? -1 : game.worth;
  const responses = Object.values(game.responses).slice(0, upToGatchaIdx);
  const GatchaCnt = GatchaNames.length;
  let responseModifier = 0;
  for (let i = 0; i < GatchaCnt; i++) {
    const cnt = (_a = responses[i]) != null ? _a : 0;
    if (cnt <= 0) {
      continue;
    }
    responseModifier += 400 / Math.max(cnt, 40) * (i + 1);
  }
  const logBase = 100 - responseModifier;
  return Math.log(worth * -1) / Math.log(logBase);
}
function bankrupt() {
  if (game.worth >= 0) {
    return;
  }
  game.bankruptcies++;
  const [name, nerfType] = pickReward(
    game.gatchaRewards,
    game.gatchaRewardChanceModifier
  );
  const divisor = getBankruptcyValue();
  game.divisors[name][nerfType] += divisor;
  const message = `${name} ${nerfType} reduced by ${ceil(divisor)}`;
  resetGameValues();
  Notify.create({
    message: `broke, broke again
 ${message}`,
    type: "responseTier"
  });
}
function prestigeCost(type) {
  return power(game[type].base.cost, game[type].scale.cost, game[type].cnt);
}
const PrestigeTypes = ["crisis", "retirement"];
const PrestigeDescriptions = {
  crisis: "Mid Life Crisis",
  retirement: "Retire"
};
function prestige(type) {
  game[type].cnt++;
  game.bankruptcies = 0;
  game.tmpDivisors = initialDivisors();
  for (let i = 0; i < runLazy(game[type].rewardCnt); i++) {
    const [message, effects] = pickReward(game[type].rewards);
    for (const [path, op, arg] of effects) {
      deepSet(
        game,
        path,
        setters[op](deepGet(game, path), arg)
      );
    }
    Notify.create({
      message: `${message}`,
      type
    });
  }
  const prestige2 = { crisis, retirement }[type];
  prestige2();
}
function canPrestige(type) {
  return game.worth > prestigeCost(type);
}
function crisis() {
  resetGameValues();
  game.gatchaRewards = Gatcha.mkRewardTable(availableGatchas());
  game.divisors = initialDivisors();
  game.multipliers = initialMultipliers();
}
function retirement() {
}
const tiers = [5, 12, 25, 30, 50];
function checkTiers(name, oldCnt, newCnt) {
  const reached = tiers.map(
    (x, i) => {
      var _a;
      return oldCnt < x && newCnt >= x ? { tier: i, message: (_a = gatchas[name].tierMessages[i]) != null ? _a : "TBD" } : false;
    }
  ).filter((x) => x != false);
  for (const t of reached) {
    if (t) {
      const maxTiers = gatchas[name].tierMessages.length - 1;
      console.log({ tier: t.tier, maxTiers });
      let message = "";
      const divisor = 1;
      if (t.tier === maxTiers) {
        game.multipliers[name].cost += 1e6;
        message = `${name} is no longer interested in you`;
      } else if (t.tier === maxTiers - 1) {
        game.multipliers[name].value -= divisor / 1e4;
        message = `${name} me? No, ${name} you`;
      } else if (t.tier === maxTiers - 2) {
        game.multipliers[name].value = 0;
        message = `You no longer fall for ${name}`;
      } else {
        game.tmpDivisors[name].value += divisor;
      }
      Notify.create({
        message: `${t.message} ${message}`,
        type: "tier"
      });
    }
  }
  return reached;
}
function crisisRewards(game2) {
  return RewardTable([
    ["Extra Income", [[keyPath(game2, "baseIncome"), "*=", 1.1]]],
    [
      "Less likely to receive same rewards",
      [[keyPath(game2, "gatchaRewardChanceModifier"), "+=", 1]]
    ],
    [
      "More likely to receive same reward after getting all rewards",
      [[keyPath(game2, "gatchaRewardChanceModifierScaling"), "*=", 2]]
    ]
  ]);
}
function retirementRewards(game2) {
  return RewardTable([
    [
      "Rewards per Mid Life Crises",
      [[keyPath(game2, "crisis", "rewardCnt"), "+=", 1]]
    ],
    [
      "Mid Life Crisis cost reduced",
      [[keyPath(game2, "crisis", "base", "cost"), "*=", 0.9]]
    ],
    [
      "Mid Life Crisis scaling reduced",
      [[keyPath(game2, "crisis", "scale", "cost"), "*=", 0.95]]
    ],
    [
      "Mid Life Crisis income scaling increased",
      [[keyPath(game2, "crisis", "scale", "value"), "*=", 1.05]]
    ]
  ]);
}
let pause = false;
let usedTime = 0;
function gameLoop(time) {
  const deltaTime = time - usedTime;
  if (!pause && deltaTime > 500) {
    usedTime += deltaTime;
    game.worth += getIncome();
    if (mercyTicks === 0) {
      mercyEffect();
      mercyTicks--;
    } else if (mercyTicks > 0) {
      mercyTicks--;
    } else {
      detectLock(true);
    }
    save();
  }
  nextTick(() => requestAnimationFrame(gameLoop));
}
const loaded = ref(false);
load();
requestAnimationFrame(gameLoop);
let mercyTicks = -1;
let mercyEffect = () => {
};
const TickLimit = 60;
function detectLock(doSetMercy) {
  const [_name, cost] = [
    ...PrestigeTypes.map((name) => [name, prestigeCost(name)]),
    ...GatchaNames.slice(0, availableGatchas()).map(
      (name) => [name, getScaledGatcha(name, "cost")]
    )
  ].reduce((a, b) => b[1] < a[1] ? b : a);
  if (cost <= game.worth) {
    return 0;
  }
  const income = getIncome();
  if (income === 0) {
    setMercy(doSetMercy, "handle zero income", () => {
      game.worth = cost;
    });
  } else if (income < 0) {
    const ticksNeeded = -1 * game.worth / income;
    if (ticksNeeded >= TickLimit) {
      setMercy(doSetMercy, "handle too long until bankrupt", () => {
        game.worth = 0;
      });
    }
    return Math.max(ticksNeeded, 0);
  } else {
    const moneyNeeded = cost - game.worth;
    const ticksNeeded = moneyNeeded / income;
    if (ticksNeeded >= TickLimit) {
      setMercy(doSetMercy, "handle too long until buyable", () => {
        game.worth = cost;
      });
    }
    return Math.max(ticksNeeded, 0);
  }
  return 0;
}
function setMercy(doSetMercy, msg, effect) {
  if (!doSetMercy) {
    return;
  }
  mercyTicks = 30;
  TODO(msg);
  mercyEffect = effect;
}
function availableGatchas() {
  return game.crisis.cnt + 1;
}
function save() {
  const saveStr = JSON.stringify(game);
  window.localStorage.setItem(SaveKey, saveStr);
}
function load() {
  var _a;
  const saveStr = window.localStorage.getItem(SaveKey);
  if (defined(saveStr)) {
    const loadedGame = JSON.parse(saveStr);
    resetTutorials();
    Object.assign(game, loadedGame);
    (_a = game.currentTutorial) != null ? _a : game.currentTutorial = game.tutorialFlags.SplashScreen.shown ? void 0 : "SplashScreen";
    loaded.value = true;
  }
}
let resetSafety = 6;
function hardReset() {
  resetSafety--;
  if (resetSafety <= 0) {
    pause = true;
    window.localStorage.removeItem(SaveKey);
    window.location.reload();
  }
  Notify.create({
    type: "reset",
    message: `Click ${resetSafety} more times to wipe all progress`
  });
  return resetSafety;
}
function runLazy(t) {
  return typeof t === "number" ? t : deepGet(game, t);
}
function finishTutorial(onFinish) {
  if (!game.currentTutorial)
    return;
  game.tutorialFlags[game.currentTutorial].shown = true;
  game.currentTutorial = void 0;
  onFinish();
  save();
}
var QCard = createComponent({
  name: "QCard",
  props: {
    ...useDarkProps,
    tag: {
      type: String,
      default: "div"
    },
    square: Boolean,
    flat: Boolean,
    bordered: Boolean
  },
  setup(props, { slots }) {
    const { proxy: { $q } } = getCurrentInstance();
    const isDark = useDark(props, $q);
    const classes = computed(
      () => "q-card" + (isDark.value === true ? " q-card--dark q-dark" : "") + (props.bordered === true ? " q-card--bordered" : "") + (props.square === true ? " q-card--square no-border-radius" : "") + (props.flat === true ? " q-card--flat no-shadow" : "")
    );
    return () => h(props.tag, { class: classes.value }, hSlot(slots.default));
  }
});
export { GatchaNames as G, PrestigeDescriptions as P, QItem as Q, useDark as a, QItemSection as b, ceil as c, availableGatchas as d, game as e, detectLock as f, getBankruptcyValue as g, QSpace as h, hardReset as i, QList as j, QCard as k, loaded as l, mercyTicks as m, finishTutorial as n, nextBuy as o, prestigeCost as p, getDivisor as q, affordable as r, respond as s, getScaledGatcha as t, useDarkProps as u, getIncome as v, bankrupt as w, canPrestige as x, prestige as y };
