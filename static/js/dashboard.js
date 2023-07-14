const dark = document.querySelector(".dark");
const light = document.querySelector(".light");

dark.addEventListener("click", function () {
  document.querySelector("body").classList.add("darkMode");
  light.classList.remove("active");
  dark.classList.add("active");
});

light.addEventListener("click", function () {
  document.querySelector("body").classList.remove("darkMode");
  dark.classList.remove("active");
  light.classList.add("active");
});

function activateMenuItem(index) {
  // Get all menu items and content sections
  var menuItems = document.getElementsByClassName("menu-item");
  var contentSections = document.getElementsByClassName("content-section");
  // console.log('contentSections', contentSections)
  // return 
  // Remove "active" class from all menu items and content sections
  for (var i = 0; i < menuItems.length; i++) {
    try{
      menuItems[i].classList.remove("active");
      contentSections[i].classList.remove("active");
    } catch (error){console.log("error", error.message)}
  }

  // Add "active" class to the clicked menu item and corresponding content section
  menuItems[index].classList.add("active");
  
  contentSections[index].classList.add("active");
}
