export const getColor = (state: string) => {
  switch (state) {
    case "ACTIVE":
      return "#22c55e";
    case "WARNING":
      return "#ef4444";
    case "INACTIVE":
      return "#6b7280";
    default:
      return "#22c55e";
  }
};
