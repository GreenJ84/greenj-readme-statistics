/** @format */

const usernameInput = document.getElementById("username");
const themeSelect = document.getElementById("themeSelect");
const borderRadiusInput = document.getElementById("borderRadius");
const hideBorderInput = document.getElementById("hideBorder");

const backgroundColorInput = document.getElementById("backgroundColor");
const borderColorInput = document.getElementById("borderColor");
const strokeColorInput = document.getElementById("strokeColor");

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
  console.log(location.hostname);
  console.log(location.href);
  console.log(location.origin);

  for (let modal of modals) {
    // Remove old query string and Username
    let old = modal.src.split("/");
    old.pop();
    old = old.join("/");

    // Get static customizations
    const username = usernameInput.value ? usernameInput.value : "GreenJ84";
    const theme = themeSelect.value;
    const hideBorder =
      hideBorderInput.value == "true" ? "&hideBorder=true" : "&hideBorder=false";
    const borderRadius = borderRadiusInput.value;

    // Get extra customizations
    const backgroundColor = backgroundColorInput.value
      ? `&background=${backgroundColorInput.value}`
      : "";
    const borderColor = borderColorInput.value
      ? `&border=${borderColorInput.value}`
      : "";
    const strokeColor = strokeColorInput.value
      ? `&stroke=${strokeColorInput.value}`
      : "";

    const imgString = `${old}/${username}?docsDisplay=true&theme=${theme}&borderRadius=${borderRadius}${hideBorder}${backgroundColor}${borderColor}${strokeColor}`;

    console.log(imgString);
    modal.src = imgString;
  }
});
