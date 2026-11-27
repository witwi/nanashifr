const SITE_CONTENT = {
  en: {
    lang: "en",
    pageTitle: "kkersia",
    header: {
      id: "nick",
      trigger: "kkersia",
      type: "inline",
      text: " · karmaknife · buzzer"
    },
    intro: {
      lead: "Based in UTC+4. I write ",
      code: {
        id: "code",
        trigger: "code",
        type: "inline",
        text: " - mostly backend and small utilities in C++ and C#, other languages less often"
      },
      mid1: ", dig into ",
      hardware: {
        id: "hardware",
        trigger: "PCs and internet stuff",
        type: "block",
        lead: "Hardware, general PC tinkering, netstalking, and whatever else is buried online. Mostly on desktop ",
        child: {
          id: "systems",
          trigger: "systems",
          type: "inline",
          text: " (Win11 · Nix · Debian 13)"
        },
        tail: ", plus Android."
      },
      mid2: ", ",
      gaming: {
        id: "gaming",
        trigger: "play",
        type: "block",
        lead: "Favorites: Disco Elysium, Garry's Mod, Project Zomboid, Yume Nikki, White Knuckle, SS14. The rest is on ",
        link: { text: "Steam", url: "https://steamcommunity.com/id/parapustyakoff/" },
        tail: " (well, the part that actually lives there)."
      },
      punctGaming: "",
      mid3: " a lot, and occasionally ",
      reading: {
        id: "reading",
        trigger: "read and write",
        type: "block",
        lead: "Favorite books: House of Leaves (Danielewski), Demons (Dostoevsky). I write things myself sometimes, and occasionally show up on ",
        link: { text: "Wikipedia", url: "https://ru.wikipedia.org/wiki/%D0%A3%D1%87%D0%B0%D1%81%D1%82%D0%BD%D0%B8%D0%BA:KarmaKnife" },
        tail: "."
      },
      end: "."
    },
    contacts: {
      trigger: "say hi!",
      items: [
        { label: "telegram", val: "@witwi", url: "https://t.me/witwi" },
        { label: "discord", val: "l3gki3", copy: true },
        { label: "steam", val: "parapustyakoff", url: "https://steamcommunity.com/id/parapustyakoff/" },
        { label: "wikipedia", val: "KarmaKnife", url: "https://ru.wikipedia.org/wiki/%D0%A3%D1%87%D0%B0%D1%81%D1%82%D0%BD%D0%B8%D0%BA:KarmaKnife" },
        { label: "rym", val: "noburn", url: "https://rateyourmusic.com/~noburn", note: "(a few ratings, maybe more someday)" }
      ]
    },
    ui: {
      expandAll: "expand all",
      collapse: "collapse [esc]",
      copy: "[copy]",
      copied: "[copied]",
      mailto: "[mailto]",
      mute: "mute",
      unmute: "unmute"
    }
  },
  ru: {
    lang: "ru",
    pageTitle: "kkersia",
    header: {
      id: "nick",
      trigger: "kkersia",
      type: "inline",
      text: " · karmaknife · buzzer"
    },
    intro: {
      lead: "Живу в UTC+4. Пишу ",
      code: {
        id: "code",
        trigger: "код",
        type: "block",
        lead: "В основном бэкенд и небольшие утилиты на C++ и C#, другие языки использую реже. Из ",
        child: {
          id: "systems",
          trigger: "систем",
          type: "inline",
          text: " (Win11 · Nix · Debian 13)"
        },
        tail: " — в основном десктоп."
      },
      mid1: ", много ",
      mid2: "",
      gaming: {
        id: "gaming",
        trigger: "играю",
        type: "block",
        lead: "Любимое: Disco Elysium, Garry's Mod, Project Zomboid, Yume Nikki, White Knuckle, SS14. Остальное можно глянуть в ",
        link: { text: "Steam", url: "https://steamcommunity.com/id/parapustyakoff/" },
        tail: " (хотя там далеко не всё)."
      },
      punctGaming: ",",
      mid3: " иногда ",
      reading: {
        id: "reading",
        trigger: "читаю и пишу",
        type: "block",
        lead: "Любимые книги: «Дом листьев» (Данилевский), «Бесы» (Достоевский). Иногда пишу что-то сам и захожу на ",
        link: { text: "Википедию", url: "https://ru.wikipedia.org/wiki/%D0%A3%D1%87%D0%B0%D1%81%D1%82%D0%BD%D0%B8%D0%BA:KarmaKnife" },
        tail: "."
      },
      end: "."
    },
    contacts: {
      trigger: "пишите!",
      items: [
        { label: "telegram", val: "@witwi", url: "https://t.me/witwi" },
        { label: "discord", val: "l3gki3", copy: true },
        { label: "steam", val: "parapustyakoff", url: "https://steamcommunity.com/id/parapustyakoff/" },
        { label: "wikipedia", val: "KarmaKnife", url: "https://ru.wikipedia.org/wiki/%D0%A3%D1%87%D0%B0%D1%81%D1%82%D0%BD%D0%B8%D0%BA:KarmaKnife" },
        { label: "rym", val: "noburn", url: "https://rateyourmusic.com/~noburn", note: "(пара оценок, может когда-нибудь дойдут руки)" }
      ]
    },
    ui: {
      expandAll: "раскрыть всё",
      collapse: "свернуть [esc]",
      copy: "[копировать]",
      copied: "[скопировано]",
      mailto: "[написать]",
      mute: "тихо",
      unmute: "звук"
    }
  }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = SITE_CONTENT;
}
