export const ConstructionTypeTable = {
    dagger: {
        constructionType: "Dagger",
        m1: [
            [4.5, 1],
            [4.5, 1],
            [4.5, 1],
        ],
        m2: [[4.5, 1]],
    },
    onehand_sword: {
        constructionType: "OneHanded sword",
        m1: [
            [5, 1],
            [5, 1],
            [5, 1],
        ],
        m2: [[8, 1]],
    },
    twohand_sword: {
        constructionType: "TwoHanded sword",
        m1: [
            [5.5, 1],
            [5.5, 1],
            [5.5, 1],
        ],
        m2: [[9, 1]],
    },
    greatsword: {
        constructionType: "Greatsword",
        m1: [
            [7, 1],
            [7, 1],
            [7, 1],
        ],
        m2: [[11, 1]],
    },
    unbalanced_sword: {
        constructionType: "Unbalanced Sword",
        m1: [
            [7.5, 1],
            [12, 1],
        ],
        m2: [[15, 1]],
    },
    mallet: {
        constructionType: "Mallet",
        m1: [
            [5, 1],
            [5, 1],
            [5, 1],
        ],
        m2: [[17, 1]],
    },
    spear: {
        constructionType: "Spear",
        m1: [
            [5, 1],
            [5, 1],
            [5, 1],
        ],
        m2: [[10, 1]],
    },
    great_spear: {
        constructionType: "Great Spear",
        m1: [
            [6, 1],
            [10, 1],
        ],
        m2: [[4, 3]],
    },
    war_hammer: {
        constructionType: "Warhammer",
        m1: [
            [6, 1],
            [6, 1],
            [9, 1],
        ],
        m2: [[6.5, 2]],
    },
    fist: {
        constructionType: "Fist",
        m1: [
            [5.5, 1],
            [5.5, 1],
            [2.7, 3],
        ],
        m2: [[15.5, 1]],
    },
    rapier: {
        constructionType: "Rapier",
        m1: [
            [4.5, 1],
            [4.5, 1],
            [1.5, 4],
        ],
        m2: [[7.5, 1]],
    },
    dual_daggers: {
        constructionType: "Dual Daggers",
        m1: [
            [4, 1],
            [1.4, 5],
            [1.4, 5],
        ],
        m2: [[11, 1]],
    },
    dual_swords: {
        constructionType: "Dual Swords",
        m1: [
            [3, 2],
            [3, 2],
            [6, 1],
        ],
        m2: [[5, 1]],
    },
    dual_unbalanced_swords: {
        constructionType: "Dual Unbalanced Swords",
        m1: [
            [12, 1],
            [12, 1],
        ],
        m2: [
            [8, 2],
            [12, 1],
        ],
    },
    dual_mallets: {
        constructionType: "Dual Mallets",
        m1: [
            [5, 1],
            [1, 5],
            [5, 1],
        ],
        m2: [[18.5, 1]],
    },
    chainsaw: {
        constructionType: "Chainsaw",
        m1: [
            [2.7, 2],
            [2.7, 2],
            [2.7, 2],
        ],
        m2: [[1.7, 5]],
    },
    side_gun: {
        constructionType: "Side Gun",
        m2: [[7, 1]],
    },
    dual_guns: {
        constructionType: "Dual Guns",
        m1: [
            [7, 1],
            [7, 1],
        ],
        m2: [[1.6, 8]],
    },
    shield: {
        constructionType: "Shield",
        m1: [
            [5, 1],
            [5, 1],
            [10, 1],
        ],
        m2: [[5, 1]],
    },
};
export const WeaponTypeTable = {
    small_handle: {
        small_blade: "dagger",
        medium_blade: "onehand_sword",
        heavy_blade: "unbalanced_sword",
        hammer_blade: "mallet",
    },
    medium_handle: {
        small_blade: "dagger",
        medium_blade: "onehand_sword",
        heavy_blade: "unbalanced_sword",
        hammer_blade: "mallet",
    },
    heavy_handle: {
        small_blade: "dagger",
        medium_blade: "twohand_sword",
        heavy_blade: "greatsword",
        hammer_blade: "mallet",
    },
    long_handle: {
        small_blade: "dagger",
        medium_blade: "twohand_sword",
        heavy_blade: "greatsword",
        hammer_blade: "mallet",
    },
    pole: {
        small_blade: "spear",
        medium_blade: "spear",
        heavy_blade: "great_spear",
        hammer_blade: "war_hammer",
    },
    glove: {
        essence: "fist",
    },
    shield: {
        essence: "shield",
    },
};
