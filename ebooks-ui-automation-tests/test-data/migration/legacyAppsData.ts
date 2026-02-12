type LegacyApp = {
  title: string;
  url: Record<"dev" | "qa" | "prod", string>;
  staticPageHeadingText: string;
  id: string;
  language: string;
  modalHeadingText: string;
};

const legacyAppsData: LegacyApp[] = [
  {
    title: "PIW",
    url: {
      dev: "",
      qa: "https://qa.plus-im-web.de/",
      prod: "https://plus-im-web.de/"
    },
    staticPageHeadingText:
      "Eine neue Möglichkeit, auf Ihre zusätzlichen Inhalte von Elsevier zuzugreifen",
    id: "plus-im-web",
    language: "DE",
    modalHeadingText:
      "Eine neue Möglichkeit, auf Ihre zusätzlichen Inhalte aus Elseviers Büchern zuzugreifen"
  },
  {
    title: "SC",
    url: {
      dev: "",
      qa: "https://qa.studentconsult.es/",
      prod: "https://studentconsult.es/"
    },
    staticPageHeadingText: "Una nueva forma de acceder a tu contenido adicional de Elsevier",
    id: "studentconsult",
    language: "ES",
    modalHeadingText:
      "Una nueva forma de acceder a tu contenido adicional de los libros de Elsevier"
  },
  {
    title: "eLibrary",
    url: {
      dev: "https://dev-ebooks.health.elsevier.com/elsevier-elibrary",
      qa: "https://qa-ebooks.health.elsevier.com/elsevier-elibrary",
      prod: "https://ebooks.health.elsevier.com/elsevier-elibrary"
    },
    staticPageHeadingText: "電子版へのアクセス方法が変更になります",
    id: "elsevier-elibrary",
    language: "JA",
    modalHeadingText: "eBooks+のご利用方法について"
  }
];

export default legacyAppsData;
