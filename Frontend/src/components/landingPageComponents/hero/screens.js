import jb1 from "../../../assets/job1.jpeg";
import jb2 from "../../../assets/job2.jpeg";
import jb3 from "../../../assets/job3.jpeg";
import jb4 from "../../../assets/job4.jpeg";

/**
 * One entry per sidebar tab, keyed the same as Sidebar's NAV_ITEMS. Each
 * entry drives what the mockup shows: the chrome-bar label and the
 * screenshot underneath it. Swap any `image` for a fresher screenshot
 * whenever you have one — nothing else needs to change.
 */
export const SCREENS = {
  overview: {
    path: "advertisement/overview",
    title: "Advertisement Overview",
    image: jb1,
  },
  candidates: {
    path: "advertisement/.../candidate-intake",
    title: "Candidate Intake",
    image: jb2,
  },
  rounds: {
    path: "advertisement/.../rounds",
    title: "Rounds",
    image: jb3,
  },
  offer: {
    path: "advertisement/.../offer-letter",
    title: "Offer Letter",
    image: jb4,
  },
};

export default SCREENS;