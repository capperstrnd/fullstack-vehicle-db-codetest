import React, { useEffect, useState } from 'react';
import {
    DrawerBody,
    DrawerHeader,
    DrawerHeaderTitle,
    Drawer,
    DrawerFooter,
} from "@fluentui/react-components/unstable";

import {
    Button,
    Field,
    Input,
    Tag,
    TagGroup,
    TagGroupProps,
    Dialog,
    DialogActions,
    DialogBody,
    DialogContent,
    DialogSurface,
    DialogTitle,
} from "@fluentui/react-components";

import { Dismiss24Regular } from "@fluentui/react-icons";
import { VehicleType } from '../../types';

import './VehicleDetailsDrawer.css'

type DrawerDetailsProps = {
    isDrawerOpen: boolean,
    setIsDrawerOpen: Function,
    vehicles: VehicleType[],
    selectedVehicle: number,
    saveUpdateVehicle: (dbId: number, updatedVehicle: VehicleType) => Promise<boolean>;
}

export const VehicleDetailsDrawer: React.FC<DrawerDetailsProps> = (props: DrawerDetailsProps) => {
    const [currentVehicle, setCurrentVehicle] = useState<VehicleType>({
        brand: '',
        licensePlateNumber: '',
        modelName: '',
        vehicleEquipment: '[]',
        vin: '',
        id: -1
    });
    const [originalVehicle, setOriginalVehicle] = useState<VehicleType>(currentVehicle);
    const [newVehicleEquipmentTag, setNewVehicleEquipmentTag] = useState<string>('');
    const [alertOpen, setAlertOpen] = useState<boolean>(false);
    const [vehicleEquipmentTags, setVehicleEquipmentTags] = useState<string[]>([]);
    const firstTagRef = React.useRef<HTMLButtonElement>(null);

    const removeItem: TagGroupProps["onDismiss"] = (e, data) => {
        const updatedArray = [...vehicleEquipmentTags].filter((tag) => tag !== data.value);
        setVehicleEquipmentTags(updatedArray);
        setCurrentVehicle(updateFields(currentVehicle, { vehicleEquipment: JSON.stringify(updatedArray) }));
    };

    function addEquipmentTag() {
        const updatedArray = [...vehicleEquipmentTags, newVehicleEquipmentTag];

        setVehicleEquipmentTags(updatedArray);
        setCurrentVehicle(updateFields(currentVehicle, { vehicleEquipment: JSON.stringify(updatedArray) }));
        setNewVehicleEquipmentTag('');
    }

    useEffect(() => {
        let selection = props.vehicles.find(x => x.id === props.selectedVehicle);

        if (selection !== undefined) {
            setCurrentVehicle(selection);
            setOriginalVehicle(selection);
        }

        if (selection?.vehicleEquipment !== undefined)
            setVehicleEquipmentTags(JSON.parse(selection?.vehicleEquipment));
    }, [props.selectedVehicle, props.vehicles]);

    function updateFields<VehicleType extends object>(
        obj: VehicleType,
        fieldsToUpdate: Partial<VehicleType>
    ): VehicleType {
        let updatedVehicle = { ...obj, ...fieldsToUpdate } as VehicleType;
        return updatedVehicle;
    }

    function dismissDrawer(open: boolean) {
        // Alert interject if originalVehicle and currentVehicle differs
        if (JSON.stringify(currentVehicle) !== JSON.stringify(originalVehicle)) {
            setAlertOpen(true);
        } else {
            props.setIsDrawerOpen(open);
        }
    }

    function alertDialogCancel() {
        // Cancel, keep unsaved changes
        setAlertOpen(false);
    }

    function alertDialogConfirmDismiss() {
        // Dismiss unsaved changes
        setCurrentVehicle(originalVehicle);
        setVehicleEquipmentTags(JSON.parse(originalVehicle.vehicleEquipment));
        setAlertOpen(false);
        props.setIsDrawerOpen(false);
    }

    function alertDialogSaveClose() {
        // save and close
        props.saveUpdateVehicle(currentVehicle.id, currentVehicle).then((success) => {
            if (success) {
                setOriginalVehicle(currentVehicle);
                setVehicleEquipmentTags(JSON.parse(currentVehicle.vehicleEquipment));
                setAlertOpen(false);
                props.setIsDrawerOpen(false);
            } else {
                console.log('Vehicle update failed.');
            }
        })
            .catch((error) => {
                console.error('An error occurred during the update:', error);
            });
    }

    function setAlertDialogOpen(open: boolean) {
        if (open === false) {
            alertDialogConfirmDismiss();
        }
        props.setIsDrawerOpen(false);
    }

    function updateSaveVehicle() {
        props.saveUpdateVehicle(currentVehicle.id, currentVehicle).then((success) => {
            if (success) {
                setOriginalVehicle(currentVehicle);
                setVehicleEquipmentTags(JSON.parse(currentVehicle.vehicleEquipment));
            } else {
                console.log('Vehicle update failed.');
            }
        })
            .catch((error) => {
                console.error('An error occurred during the update:', error);
            });
    }

    const [size, setSize] = React.useState<"medium" | "full" | "small" | "large" | undefined>("medium");

    const onMediaQueryChange = React.useCallback(
        ({ matches }) => setSize(matches ? "full" : "medium"),
        [size]
    );

    React.useEffect(() => {
        const match = window.matchMedia("(max-width: 1280px)");

        if (match.matches) {
            setSize("full");
        }

        match.addEventListener("change", onMediaQueryChange);

        return () => match.removeEventListener("change", onMediaQueryChange);
    }, [onMediaQueryChange]);

    return (
        <>
            <Drawer
                type="overlay"
                separator
                open={props.isDrawerOpen}
                onOpenChange={(_, { open }) => dismissDrawer(open)}
                position="end"
                size={size}
            >
                <DrawerHeader>
                    <DrawerHeaderTitle
                        action={
                            <Button
                                appearance="subtle"
                                aria-label="Close"
                                icon={<Dismiss24Regular />}
                                onClick={() => dismissDrawer(false)}
                            />
                        }
                    >
                        Vehicle Details
                    </DrawerHeaderTitle>
                </DrawerHeader>

                <DrawerBody>
                    <Field label="Brand">
                        <Input value={currentVehicle.brand} onChange={(ev, data) => { setCurrentVehicle(updateFields(currentVehicle, { brand: data.value })) }} />
                    </Field>
                    <Field label="Model Name">
                        <Input value={currentVehicle.modelName} onChange={(ev, data) => { setCurrentVehicle(updateFields(currentVehicle, { modelName: data.value })) }} />
                    </Field>
                    <Field label="VIN Identifier">
                        <Input value={currentVehicle.vin} onChange={(ev, data) => { setCurrentVehicle(updateFields(currentVehicle, { vin: data.value })) }} />
                    </Field>
                    <Field label="License Plate">
                        <Input value={currentVehicle.licensePlateNumber} onChange={(ev, data) => { setCurrentVehicle(updateFields(currentVehicle, { licensePlateNumber: data.value })) }} />
                    </Field>
                    <Field label="Equipment">
                        <div className="tagInput">
                            <Input className="fillWidth" value={newVehicleEquipmentTag} onChange={(ev, data) => { setNewVehicleEquipmentTag(data.value) }} />
                            <Button onClick={addEquipmentTag}>Add</Button>
                        </div>
                    </Field>

                    <TagGroup onDismiss={removeItem} aria-label="Dismiss example" className='tags'>
                        {vehicleEquipmentTags.map((tag, index) => (
                            <Tag
                                dismissible
                                dismissIcon={{ "aria-label": "remove" }}
                                value={tag}
                                key={index}
                                ref={index === 0 ? firstTagRef : null}
                            >
                                {tag}
                            </Tag>
                        ))}
                    </TagGroup>
                </DrawerBody>
                <DrawerFooter className='drawerFooter'>
                    <Button onClick={() => dismissDrawer(false)}>Close</Button>
                    <Button onClick={() => updateSaveVehicle()}>Update</Button>
                </DrawerFooter>
            </Drawer>

            <Dialog modalType="alert"
                open={alertOpen}
                onOpenChange={(event, data) => {
                    setAlertDialogOpen(data.open);
                }}
            >
                <DialogSurface>
                    <DialogBody>
                        <DialogTitle>Warning: Unsaved changes</DialogTitle>
                        <DialogContent>
                            You have unsaved changes, do you want to keep them?
                        </DialogContent>

                        <DialogActions>
                            <Button appearance="secondary" onClick={() => alertDialogConfirmDismiss()}>Ignore changes</Button>
                            <Button appearance="primary" onClick={() => alertDialogCancel()}>Keep changes</Button>
                            <Button appearance="primary" onClick={() => alertDialogSaveClose()}>Save and close</Button>
                        </DialogActions>
                    </DialogBody>
                </DialogSurface>
            </Dialog>
        </>
    );
};