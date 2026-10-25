import "./core/ui/styles.css";
import { mountHealth } from "./modules/health";

const root = document.getElementById("app");
if (root) {
  void mountHealth(root);
}
