const fs = require("fs");
const { PrismaClient } = require("@prisma/client");

const data = JSON.parse(fs.readFileSync("./metadatas.json", "utf8"));
const prisma = new PrismaClient();

async function linkAttrToCard() {
  try {
    const attributesInBDD = await prisma.attributes_rarity.findMany();

    if (!attributesInBDD) {
      throw new Error("ERROR_GET_ATTRIBUTES");
    }
    for (const card of data) {
      const { attributes } = card;
      const updateAttr = [];

      attributes.forEach((attr) => {
        const findAttr = attributesInBDD.find(
          (attribute) =>
            attribute.trait_category === attr.trait_type &&
            attribute.trait_type === attr.value
        );

        if (findAttr) {
          updateAttr.push(findAttr.id);
        }
      });
      const update = await prisma.images_collection.update({
        where: { id: card.token_id },
        data: {
          attributes: {
            connect: updateAttr.map((id) => ({
              id,
            })),
          },
        },
      });
      console.log(update)
      if (!update) {
        throw new Error("ERR_UPDATE_LINK");
      }
      console.log(`Création du lien en BDD pour la carte ${card.name}`);
    }
  } catch (error) {
    console.error(error);
  }
}

linkAttrToCard();