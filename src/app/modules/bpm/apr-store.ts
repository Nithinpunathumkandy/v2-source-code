import { observable, action, computed } from "mobx-angular";

class Store {
    @observable
    operationFrequancy=[
        {id:1, value: 'Daily'},
        {id:2, value: 'Weekly'},
        {id:3, value: 'Monthly'},
        {id:4, value: 'Quarterly'},
        {id:5, value: 'Yearly'},
        {id:5, value: 'Continuosly'}
    ]

    @observable
    mode=[
        {id:1, value: 'Centralized'},
        {id:2, value: 'Distributed'},
    ]

    @observable
    highAvailabilityStatus=[
        {id:1, value: 'Yes'},
        {id:2, value: 'No'},
        {id:3, value: 'Not Applicable'},
    ]

    @observable
    singlePointFailure=[
        {id:1, value: 'Yes'},
        {id:0, value: 'No'},
    ]

    @observable
    accessibility=[
        {id:1, value: 'Public'},
        {id:2, value: 'Private'},
        {id:2, value: 'Not Applicable'},
    ]

    @observable
    appType=[
        {id:1, value: 'Hardware'},
        {id:2, value: 'Software'},
    ]

    @observable
    softwareName=[
        {id:1, value: 'Isorobot', qty:1, maintanance:"Yes"},
        {id:2, value: 'Xiro', qty:2, maintanance:"Yes"},
    ]

    @observable
    availabiltyMaintananceContract=[
        {id:1, value: 'Yes'},
        {id:2, value: 'No'},
    ]

    @observable
    process=[
        {id:1, value: 'Process 1'},
        {id:2, value: 'Process 2'},
    ]

    @observable
    subProcess=[
        {id:1, value: 'Sub Process 1'},
        {id:2, value: 'Sub Process 2'},
    ]

    @observable
    internalDependancies=[
        {id:1, value: 'Internal Dependancies 1'},
        {id:2, value: 'Internal Dependancies 2'},
    ]

    @observable
    externalDependancies=[
        {id:1, value: 'External Dependancies 1'},
        {id:2, value: 'External Dependancies 2'},
    ]

    @observable
    storageType=[
        {id:1, value: 'Hard Copy'},
        {id:2, value: 'Soft Copy'},
    ]

    @observable
    storageLocation=[
        {id:1, value: 'Storage Location 1'},
        {id:2, value: 'Storage Location 2'},
    ]

    @observable
    backupStorage=[
        {id:1, value: 'Backup Storage 1'},
        {id:2, value: 'Backup Storage 2'},
    ]

    @observable
    periodicBackup=[
        {id:1, value: 'Periodic Backup 1'},
        {id:2, value: 'Periodic Backup 2'},
    ]

    @observable
    frquancyBackup=[
        {id:1, value: 'Frequancy Backup 1'},
        {id:2, value: 'Frequancy Backup 2'},
    ]

    @observable
    backupOffsite=[
        {id:1, value: 'Yes'},
        {id:0, value: 'No'},
    ]

    @observable
    recordRetention=[
        {id:1, value: '1 Year'},
        {id:2, value: '2 Year'},
        {id:3, value: '3 Year'},
    ]

    @observable
    isThisSinglePointFailure=[
        {id:1, value: 'Yes'},
        {id:2, value: 'No'},
    ]

    @observable
    relatedProcess=[
        {id:1, value: 'Issue identification'},
        {id:2, value: 'Ploicy Formulation'},
    ]
}

export const AprDemoStore = new Store();