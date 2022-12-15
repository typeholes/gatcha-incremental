import { c as createComponent, f as emptyRenderFn, a as computed, h, b as hSlot, k as inject, m as layoutKey, L as pageContainerKey, g as getCurrentInstance, W as defineComponent, X as openBlock, Y as createBlock, Z as withCtx, _ as createVNode, $ as unref, a3 as createTextVNode, a4 as toDisplayString, a6 as QBtn, a5 as createCommentVNode, a0 as createElementBlock, a1 as Fragment, a2 as renderList, a8 as createBaseVNode } from "./index.9019d847.js";
import { u as useDarkProps, a as useDark, G as GatchaNames, d as availableGatchas, n as nextBuy, Q as QItem, b as QItemSection, c as ceil, k as getIncome, e as game, h as QSpace, l as bankrupt, P as PrestigeDescriptions, o as canPrestige, q as prestige, r as getScaledGatcha, s as getDivisor, t as affordable, v as respond, j as QList } from "./game.d00a98a9.js";
var QPage = createComponent({
  name: "QPage",
  props: {
    padding: Boolean,
    styleFn: Function
  },
  setup(props, { slots }) {
    const { proxy: { $q } } = getCurrentInstance();
    const $layout = inject(layoutKey, emptyRenderFn);
    if ($layout === emptyRenderFn) {
      console.error("QPage needs to be a deep child of QLayout");
      return emptyRenderFn;
    }
    const $pageContainer = inject(pageContainerKey, emptyRenderFn);
    if ($pageContainer === emptyRenderFn) {
      console.error("QPage needs to be child of QPageContainer");
      return emptyRenderFn;
    }
    const style = computed(() => {
      const offset = ($layout.header.space === true ? $layout.header.size : 0) + ($layout.footer.space === true ? $layout.footer.size : 0);
      if (typeof props.styleFn === "function") {
        const height = $layout.isContainer.value === true ? $layout.containerHeight.value : $q.screen.height;
        return props.styleFn(offset, height);
      }
      return {
        minHeight: $layout.isContainer.value === true ? $layout.containerHeight.value - offset + "px" : $q.screen.height === 0 ? offset !== 0 ? `calc(100vh - ${offset}px)` : "100vh" : $q.screen.height - offset + "px"
      };
    });
    const classes = computed(
      () => `q-page${props.padding === true ? " q-layout-padding" : ""}`
    );
    return () => h("main", {
      class: classes.value,
      style: style.value
    }, hSlot(slots.default));
  }
});
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
var QCardSection = createComponent({
  name: "QCardSection",
  props: {
    tag: {
      type: String,
      default: "div"
    },
    horizontal: Boolean
  },
  setup(props, { slots }) {
    const classes = computed(
      () => `q-card__section q-card__section--${props.horizontal === true ? "horiz row no-wrap" : "vert"}`
    );
    return () => h(props.tag, { class: classes.value }, hSlot(slots.default));
  }
});
const _hoisted_1 = /* @__PURE__ */ createBaseVNode("br", null, null, -1);
const _hoisted_2 = /* @__PURE__ */ createBaseVNode("br", null, null, -1);
const _hoisted_3 = /* @__PURE__ */ createBaseVNode("br", null, null, -1);
const _hoisted_4 = /* @__PURE__ */ createBaseVNode("br", null, null, -1);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "GameView",
  setup(__props) {
    const names = computed(() => GatchaNames.slice(0, availableGatchas()));
    const calcNext = Object.fromEntries(
      GatchaNames.map((name) => [name, computed(() => nextBuy(name))])
    );
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(QList), {
        bordered: "",
        separator: ""
      }, {
        default: withCtx(() => [
          createVNode(unref(QItem), null, {
            default: withCtx(() => [
              createVNode(unref(QItemSection), null, {
                default: withCtx(() => [
                  createVNode(unref(QCard), null, {
                    default: withCtx(() => [
                      createVNode(unref(QCardSection), {
                        horizontal: "",
                        class: "items-center"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(QCardSection), null, {
                            default: withCtx(() => [
                              createTextVNode(" Income: $" + toDisplayString(unref(ceil)(unref(getIncome)())), 1)
                            ]),
                            _: 1
                          }),
                          createVNode(unref(QCardSection), null, {
                            default: withCtx(() => [
                              createTextVNode(" Net Worth: $" + toDisplayString(unref(ceil)(unref(game).worth)), 1)
                            ]),
                            _: 1
                          }),
                          createVNode(QSpace),
                          createVNode(unref(QCardSection), null, {
                            default: withCtx(() => [
                              unref(game).worth <= 0 ? (openBlock(), createBlock(unref(QBtn), {
                                key: 0,
                                label: "Go Bankrupt",
                                onClick: unref(bankrupt)
                              }, null, 8, ["onClick"])) : createCommentVNode("", true)
                            ]),
                            _: 1
                          }),
                          (openBlock(true), createElementBlock(Fragment, null, renderList(unref(PrestigeDescriptions), (description, type) => {
                            return openBlock(), createBlock(unref(QCardSection), { key: type }, {
                              default: withCtx(() => [
                                unref(canPrestige)(type) ? (openBlock(), createBlock(unref(QBtn), {
                                  key: 0,
                                  label: description,
                                  onClick: ($event) => unref(prestige)(type)
                                }, null, 8, ["label", "onClick"])) : createCommentVNode("", true)
                              ]),
                              _: 2
                            }, 1024);
                          }), 128))
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          (openBlock(true), createElementBlock(Fragment, null, renderList(unref(names), (name) => {
            return openBlock(), createBlock(unref(QItem), { key: name }, {
              default: withCtx(() => [
                createVNode(unref(QItemSection), null, {
                  default: withCtx(() => [
                    createVNode(unref(QCard), null, {
                      default: withCtx(() => [
                        createVNode(unref(QCardSection), {
                          horizontal: "",
                          class: "items-center"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(QCardSection), null, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(name), 1)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(unref(QCardSection)),
                            createVNode(unref(QCardSection), null, {
                              default: withCtx(() => {
                                var _a;
                                return [
                                  createTextVNode(" Repsonses " + toDisplayString((_a = unref(game).responses[name]) != null ? _a : "mising"), 1)
                                ];
                              }),
                              _: 2
                            }, 1024),
                            createVNode(unref(QCardSection), null, {
                              default: withCtx(() => [
                                createTextVNode(" Losses " + toDisplayString(unref(ceil)(unref(getScaledGatcha)(name, "value"))) + " ", 1),
                                _hoisted_1,
                                createTextVNode("/ " + toDisplayString(unref(ceil)(unref(getDivisor)(name, "value"))) + " ", 1),
                                _hoisted_2,
                                createTextVNode("* " + toDisplayString(unref(ceil)(unref(game).multipliers[name].value)), 1)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(unref(QCardSection), null, {
                              default: withCtx(() => [
                                createVNode(unref(QBtn), {
                                  label: "respond: " + unref(ceil)(unref(getScaledGatcha)(name, "cost")),
                                  disable: !unref(affordable)(name),
                                  onClick: ($event) => unref(respond)(name)
                                }, null, 8, ["label", "disable", "onClick"]),
                                _hoisted_3,
                                createTextVNode("/ " + toDisplayString(unref(ceil)(unref(getDivisor)(name, "cost"))) + " ", 1),
                                _hoisted_4,
                                createTextVNode("* " + toDisplayString(unref(ceil)(unref(game).multipliers[name].cost)), 1)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(unref(QCardSection), null, {
                              default: withCtx(() => [
                                createVNode(unref(QBtn), {
                                  label: unref(calcNext)[name].value.map(unref(ceil)).join(": "),
                                  disable: unref(game).worth < unref(calcNext)[name].value[1],
                                  onClick: ($event) => unref(respond)(name, unref(calcNext)[name].value)
                                }, null, 8, ["label", "disable", "onClick"])
                              ]),
                              _: 2
                            }, 1024)
                          ]),
                          _: 2
                        }, 1024)
                      ]),
                      _: 2
                    }, 1024)
                  ]),
                  _: 2
                }, 1024)
              ]),
              _: 2
            }, 1024);
          }), 128))
        ]),
        _: 1
      });
    };
  }
});
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "IndexPage",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createBlock(QPage, { class: "row items-center justify-evenly" }, {
        default: withCtx(() => [
          createVNode(_sfc_main$1)
        ]),
        _: 1
      });
    };
  }
});
export { _sfc_main as default };
