export type EditRange = {
  start: number;
  end: number;
};

type EditHistory = {
  value: string | undefined;
  range: EditRange;
};

export default EditHistory;
