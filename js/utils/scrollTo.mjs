export const scrollToPage = (id) => {
    try {
      document.getElementById(id).scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    } catch {
      const a = document.createElement("a");
      a.href = "#" + id;
      a.click();
    }
  };
  