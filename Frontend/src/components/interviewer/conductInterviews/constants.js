export const STATUS = {
  UPCOMING: "Upcoming",
  ONGOING: "Ongoing",
  COMPLETED: "Completed",
  NO_SHOW: "No Show",
  CANCELLED: "Cancelled",
};

export function getInterviewCounts(list = []) {
  return list.reduce(
    (counts, item) => {
      counts.total += 1;

      switch (item.statusBadge) {
        case STATUS.UPCOMING:
          counts.upcoming += 1;
          break;
        case STATUS.ONGOING:
          counts.ongoing += 1;
          break;
        case STATUS.COMPLETED:
          counts.completed += 1;
          break;
        case STATUS.NO_SHOW:
          counts.noShow += 1;
          break;
        case STATUS.CANCELLED:
          counts.cancelled += 1;
          break;
        default:
          break;
      }

      return counts;
    },
    {
      upcoming: 0,
      ongoing: 0,
      completed: 0,
      noShow: 0,
      cancelled: 0,
      total: 0,
    }
  );
}
