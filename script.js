
  (() => {

    const slider = document.getElementById("categorySlider");
    const list = document.getElementById("categoryList");

    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    const items = [...list.querySelectorAll(".category")];

    let isDragging = false;
    let startX = 0;
    let startScroll = 0;

    /* --------------------------------
       Update navigation state
    -------------------------------- */

    function updateNavigation() {

      const maxScroll =
        list.scrollWidth - list.clientWidth;

      const currentScroll = list.scrollLeft;

      const canGoLeft = currentScroll > 2;
      const canGoRight =
        currentScroll < maxScroll - 2;

      prevBtn.classList.toggle(
        "hidden",
        !canGoLeft
      );

      nextBtn.classList.toggle(
        "hidden",
        !canGoRight
      );

      slider.classList.toggle(
        "can-scroll-left",
        canGoLeft
      );

      slider.classList.toggle(
        "can-scroll-right",
        canGoRight
      );
    }


    /* --------------------------------
       Scroll buttons
    -------------------------------- */

    function scrollByAmount(direction) {

      const amount =
        Math.max(list.clientWidth * .65, 220);

      list.scrollBy({
        left: direction * amount,
        behavior: "smooth"
      });
    }

    nextBtn.addEventListener("click", () => {
      scrollByAmount(1);
    });

    prevBtn.addEventListener("click", () => {
      scrollByAmount(-1);
    });


    /* --------------------------------
       Active category
    -------------------------------- */

    items.forEach((item, index) => {

      item.addEventListener("click", () => {

        items.forEach(button => {
          button.classList.remove("active");
          button.setAttribute("aria-selected", "false");
        });

        item.classList.add("active");
        item.setAttribute("aria-selected", "true");

        /*
          Keep selected item visible.
        */
        item.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center"
        });

        // Replace this with your filtering/API logic.
        console.log(
          "Selected:",
          item.textContent.trim()
        );
      });

    });


    /* --------------------------------
       Mouse wheel
    -------------------------------- */

    list.addEventListener(
      "wheel",
      (event) => {

        if (Math.abs(event.deltaY) >
            Math.abs(event.deltaX)) {

          event.preventDefault();

          list.scrollLeft += event.deltaY;
        }

      },
      { passive: false }
    );


    /* --------------------------------
       Mouse / touch dragging
    -------------------------------- */

    list.addEventListener("pointerdown", event => {

      /*
        Don't treat button clicks as drag.
      */
      if (event.target.closest(".category")) {
        return;
      }

      isDragging = true;

      startX = event.clientX;
      startScroll = list.scrollLeft;

      list.classList.add("dragging");

      list.setPointerCapture(event.pointerId);
    });


    list.addEventListener("pointermove", event => {

      if (!isDragging) return;

      const distance =
        event.clientX - startX;

      list.scrollLeft =
        startScroll - distance;

    });


    function stopDragging() {

      isDragging = false;

      list.classList.remove("dragging");
    }

    list.addEventListener(
      "pointerup",
      stopDragging
    );

    list.addEventListener(
      "pointercancel",
      stopDragging
    );

    list.addEventListener(
      "lostpointercapture",
      stopDragging
    );


    /* --------------------------------
       Keyboard controls
    -------------------------------- */

    list.addEventListener("keydown", event => {

      switch (event.key) {

        case "ArrowRight":
          event.preventDefault();
          scrollByAmount(1);
          break;

        case "ArrowLeft":
          event.preventDefault();
          scrollByAmount(-1);
          break;

        case "Home":
          event.preventDefault();

          list.scrollTo({
            left: 0,
            behavior: "smooth"
          });

          break;

        case "End":
          event.preventDefault();

          list.scrollTo({
            left: list.scrollWidth,
            behavior: "smooth"
          });

          break;
      }

    });


    /* --------------------------------
       Scroll listener
    -------------------------------- */

    list.addEventListener(
      "scroll",
      updateNavigation,
      { passive: true }
    );


    /* --------------------------------
       Resize handling
    -------------------------------- */

    const resizeObserver =
      new ResizeObserver(updateNavigation);

    resizeObserver.observe(list);


    /* --------------------------------
       Initial state
    -------------------------------- */

    updateNavigation();

  })();
  