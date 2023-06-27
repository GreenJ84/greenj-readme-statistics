/** @format */

const usernameInput = document.getElementById("username");
const themeSelect = document.getElementById("themeSelect");
const borderRadiusInput = document.getElementById("borderRadius");
const hideBorderInput = document.getElementById("hideBorder");
const update = document.getElementById("update");

const Themes = await fetch("/themes")
  .then((res) => res.json())
  .catch((err) => console.log(err));

for (let theme of Themes.themes) {
  const option = document.createElement("option");
  option.innerHTML = theme
    .split("-")
    .map((x) => x.charAt(0).toUpperCase() + x.slice(1))
    .join(" ");

  option.value = theme.replace("-", "_");
  themeSelect.appendChild(option);
}

update.addEventListener("click", (e) => {
  e.preventDefault();
  let modals = document.getElementsByClassName("svgModal");

  for (let modal of modals) {
    let old = modal.src.split("/");
    old.pop();
    old = old.join("/");

    const username = usernameInput.value ?? "GreenJ84";
    const theme = themeSelect.value;
    const hideBorder =
      hideBorderInput.value == "true" ? "&hideBorder=true" : "";
    const borderRadius = borderRadiusInput.value;

    console.log(
      `${old}/${username}?docsDisplay=true&theme=${theme}${hideBorder}&borderRadius=${borderRadius}`
    );
    modal.src = `${old}/${username}?docsDisplay=true&theme=${theme}${hideBorder}&borderRadius=${borderRadius}`;
  }
});
