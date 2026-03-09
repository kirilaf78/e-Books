const getChapterPii = function (this: { vbid: string }) {
  return `${this.vbid}XXXX0X0`;
};

export const books = {
  Neurología: {
    title: "Neurología",
    isbns: ["9788491130710"]
  },
  "Brenner and Stevens’ Pharmacology": {
    title: "Brenner and Stevens’ Pharmacology",
    publicationTitle: "Brenner and Stevens’ Pharmacology",
    isbns: [
      "9780323391726",
      "9780323391719",
      "9780323391702",
      "9780323391696",
      "9780323391689",
      "9780323391665"
    ],
    vbid: "9780323391733",
    masterIsbn: "9780323391665"
  },
  "Talley and O'Connor's Clinical Examination": {
    title: "Talley and O'Connor's Clinical Examination",
    publicationTitle: "Talley and O'Connor's Clinical Examination - 2-Volume Set",
    isbns: [
      "9780729586184",
      "9780729587075",
      "9780729587068",
      "9780729587051",
      "9780729586177",
      "9780729542913",
      "9780729542906",
      "9780729542890",
      "9780729542593"
    ],
    vbid: "9780729586191",
    masterIsbn: "9780729542593"
  },
  "Plastic Surgery": {
    title: "Plastic Surgery",
    isbns: ["9780323357128"],
    vbid: "9780323357142"
  },
  "Muscle Biopsy": {
    title: "Muscle Biopsy",
    isbns: ["9780702074714", "9780702078583", "9780443115226", "9780702043406"],
    vbid: "9780702078590",
    masterIsbn: "9780702074714"
  },
  "Diagnostic Ultrasound": {
    title: "Diagnostic Ultrasound",
    publicationTitle: "Diagnostic Ultrasound, 2-Volume Set",
    isbns: ["9780323931205", "9780323529631", "9780323401715", "9780323053976"],
    authors: ["Carol M. Rumack", "Deborah Levine"],
    vbid: "9780323480536",
    masterIsbn: "9780323401715",
    getChapterPii
  },
  "Aneurismas cerebrales": {
    title: "Aneurismas cerebrales",
    isbns: ["9788491138853"]
  },
  "Abordajes neuroquirúrgicos de la patología craneal y cerebral": {
    title: "Abordajes neuroquirúrgicos de la patología craneal y cerebral",
    isbns: ["9788490229552"]
  },
  "60 Fälle Rettungsdienst": {
    title: "60 Fälle Rettungsdienst",
    isbns: ["9783437482311"]
  },
  "Deutsch B1/B2 in der Pflege": {
    title: "Deutsch B1/B2 in der Pflege",
    isbns: ["9783437250033"]
  },
  "Pflege Heute": {
    title: "Pflege Heute",
    isbns: ["9783437267246"]
  },
  "Macleod. Exploración clínica": {
    title: "Macleod. Exploración clínica",
    isbns: ["9788490225424"]
  },
  "Actividad física aplicada a la osteoporosis": {
    title: "Actividad física aplicada a la osteoporosis",
    isbns: ["9788490225325"]
  },
  "Non Existent Book": {
    title: "Non Existent Book",
    isbns: ["9781234567890"]
  },
  "分子細胞免疫学　原著第10版": {
    vbid: 9784866551357,
    masterIsbn: 9784860346768,
    isbns: ["9784860346768"],
    title: "分子細胞免疫学　原著第10版"
  },
  "骨関節画像診断入門 第4版 - eBook": {
    vbid: 9784866551678,
    masterIsbn: 9784787822871,
    isbns: ["9784787822871"],
    title: "骨関節画像診断入門 第4版 - eBook"
  },
  "運動器リハビリテーションの機能評価Ⅱ　原著第7版": {
    vbid: 9784866551326,
    masterIsbn: 9784860346935,
    isbns: ["9784866551326"],
    title: "運動器リハビリテーションの機能評価Ⅱ　原著第7版"
  },
  "ビジュアルガイド末梢神経と筋　原著第5版　日本語版": {
    vbid: 9784866551968,
    masterIsbn: 9784787822277,
    isbns: ["9784787822277", "9784866551968"],
    title: "ビジュアルガイド末梢神経と筋　原著第5版　日本語版"
  },
  "ベインズ・ドミニチャク生化学 原書4版": {
    vbid: 9784866551838,
    masterIsbn: 9784621301692,
    isbns: ["9784621301692", "9784866551838"],
    title: "ベインズ・ドミニチャク生化学 原書4版"
  }
};
