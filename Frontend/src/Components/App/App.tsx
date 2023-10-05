import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import { base_url } from '../../constants';
import { VehicleList } from '../VehicleList/VehicleList';
import { VehicleType } from '../../types';
import { FluentProvider, webDarkTheme } from '@fluentui/react-components';
import { VehicleDetailsDrawer } from '../VehicleDetailsDrawer/VehicleDetailsDrawer';
import { TopBar } from '../TopBar/TopBar';
import { SearchBar } from '../SearchBar/SearchBar';

export const App: React.FunctionComponent = () => {

    const [vehicles, setVehicles] = useState<VehicleType[]>([]);
    const [selectedVehicle, setSelectedVehicle] = useState<number>(-1);
    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
    const [selectedItems, setSelectedItems] = useState<any>([]);
    const [searchInput, setSearchInput] = useState<string>('');

    useEffect(() => {
        fetchAllVehicles();
    }, []);

    function fetchAllVehicles() {
        axios.get(base_url + '/all')
            .then((response) => {
                setVehicles(response.data);
            })
            .catch((error) => {
                console.error('Error fetching vehicles:', error);
            });
    }

    function updateVehicleType(idToUpdate: number, updatedFields: Partial<VehicleType>) {
        setVehicles((prevTypes) =>
            prevTypes.map((type) =>
                type.id === idToUpdate
                    ? {
                        ...type,
                        ...updatedFields, // Update all fields specified in updatedFields
                    }
                    : type
            )
        );
    };

    function updateVehicle(dbId: number, updatedVehicle: VehicleType): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const { id, ...requestBody } = updatedVehicle;

            axios.put(base_url + '/update/' + dbId, requestBody)
                .then((response) => {
                    if (response.status === 200) {
                        updateVehicleType(dbId, updatedVehicle);
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching vehicles:', error);
                    reject(error);
                });
        });
    }

    function generateRandomVin() {
        const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let vin = '';

        for (let i = 0; i < 17; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            vin += characters.charAt(randomIndex);
        }

        return vin;
    }

    function newVehicle() {
        const requestBody = {
            "VIN": generateRandomVin(),
            "LicensePlateNumber": "-",
            "ModelName": "-",
            "Brand": "-",
            "VehicleEquipment": "[]"
        }

        axios.post(base_url + '/create', requestBody)
            .then((response) => {
                if (response.status === 201) {
                    const updatedArray = [...vehicles, response.data];
                    setVehicles(updatedArray);
                }
            })
            .catch((error) => {
                console.error('Error creating new vehicle:', error);
            });
    }

    function deleteVehicle(dbId: number, refreshVehicles: boolean = true): Promise<boolean> {
        return new Promise((resolve, reject) => {
            axios.delete(base_url + '/delete/' + dbId)
                .then((response) => {
                    if (response.status === 204) {
                        const updatedVehicles = vehicles.filter(vehicle => vehicle.id !== dbId);

                        if (refreshVehicles)
                            setVehicles(updatedVehicles);

                        resolve(true);
                    } else {
                        resolve(false);
                    }
                })
                .catch((error) => {
                    console.error('Error deleting vehicle:', error);
                    reject(error);
                });
        });

    }

    function openEditor(Id: number) {
        setSelectedVehicle(Id);
        setIsDrawerOpen(true);
    }

    async function deleteSelection() {
        await selectedItems?.forEach(async (value: number) => {
            await deleteVehicle(value, false);
        });

        let updatedVehicles = vehicles;
        selectedItems?.forEach((value: number) => {
            updatedVehicles = updatedVehicles.filter(vehicle => vehicle.id !== value);
        });
        setVehicles(updatedVehicles);

        setSelectedItems([]);
    }

    function resetSelectedItems() {
        setSelectedItems([]);
    }

    return (
        <FluentProvider theme={webDarkTheme} style={{ minHeight: 100 + 'svh' }} className='origo'>
            <nav>
                <TopBar create={newVehicle} selectedItems={selectedItems} deleteSelection={deleteSelection} />
                <SearchBar setSearchInput={setSearchInput} searchInput={searchInput} resetSelectedItems={resetSelectedItems} />
            </nav>
            <VehicleList vehicles={vehicles} openEditor={openEditor} deleteVehicle={deleteVehicle} setSelectedItems={setSelectedItems} selectedItems={selectedItems} searchInput={searchInput} />
            <VehicleDetailsDrawer isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} vehicles={vehicles} selectedVehicle={selectedVehicle} saveUpdateVehicle={updateVehicle} />
        </FluentProvider>
    );
};
