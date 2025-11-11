const { expect } = require("chai");
const {
  computeLabTestFlag,
  decorateOrderWithFlags,
} = require("../src/utils/labResultFlagger");

describe("labResultFlagger", () => {
  describe("computeLabTestFlag", () => {
    it("retourne unknown si la valeur n'est pas définie", () => {
      expect(computeLabTestFlag({})).to.equal("unknown");
    });

    it("retourne low si la valeur est inférieure au minimum", () => {
      expect(
        computeLabTestFlag({
          resultatValeur: 3.2,
          referenceMin: 4,
          referenceMax: 6,
        })
      ).to.equal("low");
    });

    it("retourne high si la valeur est supérieure au maximum", () => {
      expect(
        computeLabTestFlag({
          resultatValeur: 9,
          referenceMin: 3,
          referenceMax: 8,
        })
      ).to.equal("high");
    });

    it("retourne normal si la valeur est dans la plage", () => {
      expect(
        computeLabTestFlag({
          resultatValeur: 6,
          referenceMin: 3,
          referenceMax: 8,
        })
      ).to.equal("normal");
    });

    it("retourne normal si seule la borne min est définie et respectée", () => {
      expect(
        computeLabTestFlag({ resultatValeur: 5, referenceMin: 3 })
      ).to.equal("normal");
    });

    it("retourne high si seule la borne max est définie et dépassée", () => {
      expect(
        computeLabTestFlag({ resultatValeur: 12, referenceMax: 10 })
      ).to.equal("high");
    });
  });

  describe("decorateOrderWithFlags", () => {
    it("ajoute un flag calculé pour chaque test", () => {
      const order = {
        tests: [
          { nom: "HB", resultatValeur: 11, referenceMin: 12, referenceMax: 16 },
          { nom: "CRP", resultatValeur: 4 },
        ],
      };

      const decorated = decorateOrderWithFlags(order);

      expect(decorated.tests).to.have.lengthOf(2);
      expect(decorated.tests[0]).to.include({ flag: "low" });
      expect(decorated.tests[1]).to.include({ flag: "unknown" });
    });

    it("n'altère pas l'objet d'origine", () => {
      const order = {
        tests: [
          { nom: "HB", resultatValeur: 14, referenceMin: 12, referenceMax: 16 },
        ],
      };
      const originalClone = JSON.parse(JSON.stringify(order));

      decorateOrderWithFlags(order);

      expect(order).to.deep.equal(originalClone);
    });
  });
});
