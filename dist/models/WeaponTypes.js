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
        constructionType: "OneHand sword",
        m1: [
            [5, 1],
            [5, 1],
            [5, 1],
        ],
        m2: [[8, 1]],
    },
    twohand_sword: {
        constructionType: "TwoHand sword",
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
    warhammer: {
        constructionType: "Warhammer",
        m1: [
            [6, 1],
            [6, 1],
            [9, 1],
        ],
        m2: [[6.5, 2]],
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
        essence: "shield ",
    },
};
