const kaTexWhiteList: Record<string, any> = {
  math: [],
  annotation: [],
  semantics: [],
  mtext: [],
  mn: [],
  mo: [],
  mi: [],
  mspace: [],
  mover: [],
  munder: [],
  munderover: [],
  msup: [],
  msub: [],
  msubsup: [],
  mfrac: [],
  mroot: [],
  msqrt: [],
  mtable: [],
  mtr: [],
  mtd: [],
  mlabeledtr: [],
  mrow: [],
  menclose: [],
  mstyle: [],
  mpadded: [],
  mphantom: [],
  mglyph: [],
};

export type KaTexWhiteList = keyof typeof kaTexWhiteList;

export default kaTexWhiteList;
