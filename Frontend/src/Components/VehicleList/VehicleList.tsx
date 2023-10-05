import React, { useEffect, useState } from 'react';
import { VehicleType } from '../../types';
import {
    DataGridBody,
    DataGridRow,
    DataGrid,
    DataGridCell,
    TableCellLayout,
    TableColumnDefinition,
    createTableColumn,
    Button,
    TableColumnId,
    DataGridCellFocusMode,
    DataGridHeader,
    DataGridHeaderCell,
    TableColumnSizingOptions,
} from "@fluentui/react-components";

import './VehicleList.css';

import {
    EditRegular,
    DeleteRegular,
} from "@fluentui/react-icons";

type VehicleListProps = {
    vehicles: VehicleType[],
    openEditor: Function,
    deleteVehicle: Function,
    setSelectedItems: Function,
    selectedItems: Set<any> | undefined,
    searchInput: string
}



const getCellFocusMode = (columnId: TableColumnId): DataGridCellFocusMode => {
    switch (columnId) {
        case "singleAction":
            return "none";
        case "actions":
            return "group";
        default:
            return "cell";
    }
};

export const VehicleList: React.FC<VehicleListProps> = (props: VehicleListProps) => {

    const mobileColumns: TableColumnDefinition<VehicleType>[] = [
        createTableColumn<VehicleType>({
            columnId: "content",
            renderHeaderCell: () => {
                return "Content";
            },
            renderCell: (item: VehicleType) => {
                let xFeatures: string[] = JSON.parse(item.vehicleEquipment);

                return (
                    <TableCellLayout id="content">
                        <br />
                        <b>VIN:</b> {item.vin}<br />
                        <b>Brand:</b> {item.brand}<br />
                        <b>Model Name:</b> {item.modelName}<br />
                        <b>License Plate:</b> {item.licensePlateNumber}<br />
                        <b>Features:</b> {xFeatures.length === 0 ? "-" : xFeatures.length + " features"}
                        <br /><br />
                    </TableCellLayout>
                );
            },
        }),
        createTableColumn<VehicleType>({
            columnId: "actions",
            renderHeaderCell: () => {
                return "Actions";
            },
            renderCell: (item: VehicleType) => {
                return (
                    <div id="actions">
                        <Button aria-label="Edit" icon={<EditRegular />} onClick={(e) => {
                            e.stopPropagation();
                            props.openEditor(item.id);
                        }}
                        />
                        <Button aria-label="Delete" icon={<DeleteRegular />} onClick={(e) => {
                            e.stopPropagation();
                            props.deleteVehicle(item.id);
                        }}
                        />
                    </div>
                );
            },
        }),
    ];

    const columns: TableColumnDefinition<VehicleType>[] = [
        createTableColumn<VehicleType>({
            columnId: "VIN",
            renderHeaderCell: () => {
                return "VIN";
            },
            compare: (a, b) => {
                return a.vin.localeCompare(b.vin);
            },
            renderCell: (item: VehicleType) => {
                return (
                    <TableCellLayout id="vin">
                        {item.vin}
                    </TableCellLayout>
                );
            },
        }),
        createTableColumn<VehicleType>({
            columnId: "Brand",
            compare: (a, b) => {
                return a.brand.localeCompare(b.brand);
            },
            renderHeaderCell: () => {
                return "Brand";
            },
            renderCell: (item: VehicleType) => {
                return (
                    <TableCellLayout>
                        {item.brand}
                    </TableCellLayout>
                );
            },
        }),
        createTableColumn<VehicleType>({
            columnId: "ModelName",
            compare: (a, b) => {
                return a.modelName.localeCompare(b.modelName);
            },
            renderHeaderCell: () => {
                return "Model Name";
            },
            renderCell: (item: VehicleType) => {
                return (
                    <TableCellLayout>
                        {item.modelName}
                    </TableCellLayout>
                );
            },
        }),
        createTableColumn<VehicleType>({
            columnId: "VehicleEquipment",
            renderHeaderCell: () => {
                return "Vehicle Equipment";
            },
            renderCell: (item: VehicleType) => {

                let xFeatures: string[] = JSON.parse(item.vehicleEquipment);

                return (
                    <TableCellLayout id="vehicleEquipment">
                        {xFeatures.length === 0 ? "-" : xFeatures.length + " features"}
                    </TableCellLayout>
                );
            },
        }),
        createTableColumn<VehicleType>({
            columnId: "LicensePlateNumber",
            compare: (a, b) => {
                return a.licensePlateNumber.localeCompare(b.licensePlateNumber);
            },
            renderHeaderCell: () => {
                return "License Plate Number";
            },
            renderCell: (item: VehicleType) => {
                return (
                    <TableCellLayout>
                        {item.licensePlateNumber}
                    </TableCellLayout>
                );
            },
        }),
        createTableColumn<VehicleType>({
            columnId: "actions",
            renderHeaderCell: () => {
                return "Actions";
            },
            renderCell: (item: VehicleType) => {
                return (
                    <div id="actions">
                        <Button aria-label="Edit" icon={<EditRegular />} onClick={(e) => {
                            e.stopPropagation();
                            props.openEditor(item.id);
                        }}
                        />
                        <Button aria-label="Delete" icon={<DeleteRegular />} onClick={(e) => {
                            e.stopPropagation();
                            props.deleteVehicle(item.id);
                        }}
                        />
                    </div>
                );
            },
        }),
    ];

    const onSelectionChange = (items: any, data: any) => {
        props.setSelectedItems(Array.from(data.selectedItems));
    };

    const [filteredVehicles, setFilteredVehicles] = useState<VehicleType[]>([]);

    const [onMobile, setOnMobile] = useState<boolean>(false);

    const onMediaQueryChange = React.useCallback(
        ({ matches }) => setOnMobile(matches),
        [onMobile]
    );

    React.useEffect(() => {
        const match = window.matchMedia("(max-width: 1280px)");

        if (match.matches) {
            setOnMobile(match.matches);
        }

        match.addEventListener("change", onMediaQueryChange);

        return () => match.removeEventListener("change", onMediaQueryChange);
    }, [onMediaQueryChange]);

    useEffect(() => {
        if (props.searchInput === '')
            setFilteredVehicles([]);
        else {
            const searchString = props.searchInput.toLowerCase();

            const searchFilteredVehicles = props.vehicles.filter(vehicle => {
                return (
                    vehicle.vin.toLowerCase().includes(searchString) ||
                    vehicle.licensePlateNumber.toLowerCase().includes(searchString) ||
                    vehicle.modelName.toLowerCase().includes(searchString) ||
                    vehicle.brand.toLowerCase().includes(searchString) ||
                    vehicle.vehicleEquipment.toLowerCase().includes(searchString)
                );
            });

            setFilteredVehicles(searchFilteredVehicles);
        }

    }, [props.searchInput]);

    const columnSizingOptions: TableColumnSizingOptions = {
        content: {
            defaultWidth: 99999,
            minWidth: 150,
        },
        VIN: {
            defaultWidth: 350,
        },
        Brand: {
            defaultWidth: 250,
            idealWidth: 250,
        },
        ModelName: {
            defaultWidth: 250,
            idealWidth: 350,
        },
        VehicleEquipment: {
            minWidth: 150,
            defaultWidth: 225,
        }, 
        LicensePlateNumber: {
            minWidth: 150,
            defaultWidth: 150,
            idealWidth: 9999,
        },
        actions: {
            defaultWidth: 80,
            minWidth: 80
        },
    };

    return (
        <div className="content">
            <DataGrid
                items={props.searchInput !== '' ? filteredVehicles : props.vehicles}
                columns={onMobile ? mobileColumns : columns}
                sortable
                selectionMode="multiselect"
                getRowId={(item) => item.id}
                onSelectionChange={onSelectionChange}
                selectedItems={props.selectedItems}
                resizableColumns
                columnSizingOptions={columnSizingOptions}
            >
                {onMobile ? null :
                    <DataGridHeader>
                        <DataGridRow selectionCell={{ "aria-label": "Select all rows" }}>
                            {({ renderHeaderCell }) => (
                                <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
                            )}
                        </DataGridRow>
                    </DataGridHeader>
                }
                <DataGridBody<VehicleType>>
                    {({ item, rowId }) => (

                        <DataGridRow<VehicleType>
                            key={rowId}
                            selectionCell={{ "aria-label": "Select row" }}
                        >
                            {({ renderCell, columnId }) => (
                                <DataGridCell focusMode={getCellFocusMode(columnId)}>
                                    {renderCell(item)}
                                </DataGridCell>
                            )}
                        </DataGridRow>
                    )
                    }
                </DataGridBody>
            </DataGrid>
        </div>
    );
};
