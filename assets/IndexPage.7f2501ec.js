import { c as createComponent, C as emptyRenderFn, a as computed, h, b as hSlot, E as inject, F as layoutKey, V as pageContainerKey, g as getCurrentInstance, a0 as defineComponent, a1 as openBlock, a2 as createBlock, a3 as withCtx, a4 as createVNode, a9 as createTextVNode, aa as toDisplayString, a5 as unref, ae as createBaseVNode, ac as QBtn, a6 as createElementBlock, ab as createCommentVNode, a7 as Fragment, a8 as renderList } from "./index.524ecbcb.js";
import { o as nextBuy, b as QItemSection, k as QCard, e as game, c as ceil, q as getDivisor, r as affordable, s as respond, t as getScaledGatcha, h as QSpace, Q as QItem, G as GatchaNames, d as availableGatchas, v as getIncome, w as bankrupt, P as PrestigeDescriptions, x as canPrestige, y as prestige, j as QList } from "./QCard.1b919184.js";
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
const _hoisted_1 = { key: 0 };
const _hoisted_2 = { key: 1 };
const _hoisted_3 = { class: "q-pl-md" };
const _hoisted_4 = { class: "q-pl-md" };
const _hoisted_5 = { key: 0 };
const _hoisted_6 = { key: 1 };
const _hoisted_7 = /* @__PURE__ */ createBaseVNode("br", null, null, -1);
const _hoisted_8 = { key: 1 };
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "GatchaBlock",
  props: {
    name: null
  },
  setup(__props) {
    const props = __props;
    function incomeString() {
      const income = ceil(getScaledGatcha(props.name, "value"));
      if (income < 0) {
        return `Gains: $${-1 * income}`;
      } else {
        return `Losses: $${income}`;
      }
    }
    const calcNext = computed(() => nextBuy(props.name));
    return (_ctx, _cache) => {
      return openBlock(), createBlock(QItem, null, {
        default: withCtx(() => [
          createVNode(QItemSection, null, {
            default: withCtx(() => [
              createVNode(QCard, null, {
                default: withCtx(() => [
                  createVNode(QCardSection, {
                    horizontal: "",
                    class: "items-center"
                  }, {
                    default: withCtx(() => [
                      createVNode(QCardSection, null, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(__props.name), 1)
                        ]),
                        _: 1
                      }),
                      createVNode(QCardSection),
                      createVNode(QCardSection, null, {
                        default: withCtx(() => {
                          var _a;
                          return [
                            createTextVNode(" Responses " + toDisplayString((_a = unref(game).responses[__props.name]) != null ? _a : "missing"), 1)
                          ];
                        }),
                        _: 1
                      }),
                      createVNode(QCardSection, null, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(incomeString()) + " ", 1),
                          createBaseVNode("div", null, "/ " + toDisplayString(unref(ceil)(unref(getDivisor)(__props.name, "value"))), 1),
                          createBaseVNode("div", null, "* " + toDisplayString(unref(ceil)(unref(game).multipliers[__props.name].value)), 1)
                        ]),
                        _: 1
                      }),
                      createVNode(QCardSection, null, {
                        default: withCtx(() => [
                          createVNode(QBtn, {
                            "no-caps": "",
                            disable: !unref(affordable)(__props.name),
                            onClick: _cache[0] || (_cache[0] = ($event) => unref(respond)(__props.name))
                          }, {
                            default: withCtx(() => [
                              unref(calcNext).maxed ? (openBlock(), createElementBlock("span", _hoisted_1, " Ignoring " + toDisplayString(__props.name), 1)) : (openBlock(), createElementBlock("span", _hoisted_2, " Respond: $ " + toDisplayString(unref(ceil)(unref(getScaledGatcha)(__props.name, "cost"))), 1))
                            ]),
                            _: 1
                          }, 8, ["disable"]),
                          createBaseVNode("div", _hoisted_3, "/ " + toDisplayString(unref(ceil)(unref(getDivisor)(__props.name, "cost"))), 1),
                          createBaseVNode("div", _hoisted_4, "* " + toDisplayString(unref(ceil)(unref(game).multipliers[__props.name].cost)), 1)
                        ]),
                        _: 1
                      }),
                      createVNode(QSpace),
                      createVNode(QCardSection, null, {
                        default: withCtx(() => [
                          unref(calcNext).amt > 0 ? (openBlock(), createBlock(QBtn, {
                            key: 0,
                            "no-caps": "",
                            disable: unref(game).worth < unref(calcNext).cost && !unref(calcNext).maxed,
                            onClick: _cache[1] || (_cache[1] = ($event) => unref(respond)(__props.name, unref(calcNext)))
                          }, {
                            default: withCtx(() => [
                              unref(calcNext).maxed ? (openBlock(), createElementBlock("span", _hoisted_5, " Ignoring " + toDisplayString(__props.name), 1)) : (openBlock(), createElementBlock("span", _hoisted_6, [
                                createTextVNode(" Buy: " + toDisplayString(unref(calcNext).amt), 1),
                                _hoisted_7,
                                createTextVNode(" Cost: " + toDisplayString(unref(ceil)(unref(calcNext).cost)), 1)
                              ]))
                            ]),
                            _: 1
                          }, 8, ["disable"])) : (openBlock(), createElementBlock("div", _hoisted_8))
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
          })
        ]),
        _: 1
      });
    };
  }
});
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "GameView",
  setup(__props) {
    const names = computed(() => GatchaNames.slice(0, availableGatchas()));
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
            return openBlock(), createBlock(_sfc_main$2, {
              key: name,
              name
            }, null, 8, ["name"]);
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
