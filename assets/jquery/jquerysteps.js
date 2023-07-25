
$(document).ready(function () {
  const accordionItems = document.querySelectorAll(".accordion-item .card-header");
  accordionItems.forEach(function (item) {
    item.addEventListener("click", function () {
      this.classList.toggle("clicked");
      const isExpanded = this.getAttribute("aria-expanded") === "true";
      // Collapse other accordion items if needed
      if (isExpanded) {
        const parentAccordion = this.closest(".accordion-item");
        const allAccordionItems = parentAccordion.querySelectorAll(".accordion-item .card-header");
        allAccordionItems.forEach(function (otherItem) {
          if (otherItem !== item) {
            otherItem.classList.remove("clicked");
          }
        });
      }
    });
  });
  var currentStep = 0;
  $("#pageSteps").steps({
    headerTag: "h3",
    bodyTag: "section",
    transitionEffect: "fade",
    titleTemplate: '<span class="step"></span> <span class="title">#title#</span>',
    onStepChanging: function (event, currentIndex, newIndex) {
      // Allow backward navigation
      if (newIndex < currentIndex) {
        return true;
      }
      // Disable forward navigation
      if (newIndex > currentIndex) {
        return false;
      }
      return true;
    },
    onFinished: function (event, currentIndex) {

    }
  });
  $("[data-step-target='plan-step']").on("click", function () {
    currentStep = 1;
    $("#pageSteps").steps("setStep", currentStep);
  });

});

