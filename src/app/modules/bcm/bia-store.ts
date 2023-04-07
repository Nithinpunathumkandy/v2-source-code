import { observable, action, computed } from "mobx-angular";

class Store {

    @observable
    tierCount=[
        {id:0, value: '0'},
        {id:1, value: '1'},
        {id:2, value: '2'},
        {id:3, value: '3'},
        {id:4, value: '4'},
        {id:5, value: '5'},

    ]

    @observable
    staffCounts=[
        {id:0, value: '0'},
        {id:1, value: '1'},
        {id:2, value: '2'},
        {id:3, value: '3'},
        {id:4, value: '4'},
        {id:5, value: '5'},
    ]

    @observable
    softwareName=[
        {id:1, value: 'Isorobot', qty:1, maintanance:"Yes"},
        {id:2, value: 'Xiro', qty:2, maintanance:"Yes"},
    ]

    @observable
    hardwareName=[
        {id:1, value: 'Flatbed Scanner', qty:1, maintanance:"Yes"},
        {id:2, value: 'Central Processing Unit', qty:1, maintanance:"Yes"},
        {id:3, value: 'LED Printer', qty:1, maintanance:"Yes"},
    ]

    @observable
    biaArray=[
        {
            cat_impact_level: "2",
            impact_scenario: [
                {
                    impact_area: [
                        {
                            area_cat_level: "2",
                            area_category: "cat1",
                            area_scenario: "sce1",
                            title: "are1"
                        },
                        {
                            area_cat_level: "2",
                            area_category: "cat1",
                            area_scenario: "sce1",
                            title: "are2"
                        }
                    ],
                    scenario_category: "cat1",
                    scenario_category_level: "2",
                    title: "sce1"
                },
                {
                    impact_area: [],
                    scenario_category: "cat1",
                    scenario_category_level: "2",
                    title: "sce2"
                }
            ],
            title: "cat1"
        },
        {
            cat_impact_level: "2",
            impact_scenario: [],
            title: "cat2"
        }
    ]

    @observable
    matrixArray=[
        {
            bia_rating: "2",
            impact_category: [
                {
                    cat_impact_level: "2",
                    impact_scenario: [
                        {
                            impact_area: [
                                {
                                    area_cat_level: "2",
                                    area_category: "cat1",
                                    area_scenario: "sce1",
                                    title: "are1"
                                },
                                {
                                    area_cat_level: "2",
                                    area_category: "cat1",
                                    area_scenario: "sce1",
                                    title: "are2"
                                }
                            ],
                            scenario_category: "cat1",
                            scenario_category_level: "2",
                            title: "sce1"
                        },
                        {
                            impact_area: [],
                            scenario_category: "cat1",
                            scenario_category_level: "2",
                            title: "sce2"
                        }
                    ],
                    title: "cat1"
                },
                {
                    cat_impact_level: "2",
                    impact_scenario: [],
                    title: "cat2"
                }
            ],
            impact_level: "Low"
        },
        {
            bia_rating: "3",
            impact_category: [],
            impact_level: "Medium"
        }
    ]

    @observable
    tierArray=[
        {
            bia_scale: {
                from: 1,
                time_scale:{
                    title: "Day"
                },
                to: 7
            },
            tier_name: "Tier"
        },
        {
            bia_scale: {
                from: 8,
                time_scale:{
                    title: "Day"
                },
                to: 10
            },
            tier_name: "Tier 2"
        }
    ]
}

export const BiaDemoStore = new Store();