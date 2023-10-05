import React, { useEffect, useState } from 'react';
import './TopBar.css';
import { Button, Menu, MenuButton, MenuItem, MenuList, MenuPopover, MenuTrigger, Overflow, OverflowItem, OverflowItemProps, makeStyles, mergeClasses, shorthands, tokens, useIsOverflowItemVisible, useOverflowMenu } from '@fluentui/react-components';

const useStyles = makeStyles({
    container: {
        display: "flex",
        flexWrap: "nowrap",
        justifyContent: "flex-end",
        minWidth: 0,
        ...shorthands.overflow("hidden"),
    },

    resizableArea: {
        maxWidth: "800px",
        ...shorthands.padding("20px", "10px", "10px", "10px"),
        position: "relative",
        width: '100%'

    },
});

type TopBarProps = {
    create: Function,
    selectedItems: [],
    deleteSelection: Function
}

export const TopBar: React.FC<TopBarProps> = (props: TopBarProps) => {

    const styles = useStyles();

    const buttons = [
        { name: 'New', fn: () => props.create(), disabled: false },
        { name: 'Delete', fn: () => props.deleteSelection(), disabled: (props.selectedItems.length === 0) },
    ]

    return (
        <>
            <div className='bar'>
                <h1>Vehicles</h1>
                <Overflow>
                    <div className={mergeClasses(styles.container, styles.resizableArea)}>
                        {buttons.map((i, index) => (
                            <OverflowItem key={index} id={i.name}>
                                <Button disabled={i.disabled} onClick={() => i.fn()}>{i.name}</Button>
                            </OverflowItem>
                        ))}
                        <OverflowMenu buttons={buttons} />
                    </div>
                </Overflow>
            </div>
        </>
    )
};

const OverflowMenuItem: React.FC<{id: string, disabled: boolean, fn: Function}> = (props) => {
    const { id, disabled, fn } = props;
    const isVisible = useIsOverflowItemVisible(id);

    if (isVisible) {
        return null;
    }

    return <MenuItem disabled={disabled} onClick={() => fn()}>{id}</MenuItem>;
};


const OverflowMenu: React.FC<{ buttons:  {name: string, fn: Function, disabled: boolean}[] }> = ({ buttons }) => {
    const { ref, overflowCount, isOverflowing } =
        useOverflowMenu<HTMLButtonElement>();

    if (!isOverflowing) {
        return null;
    }

    return (
        <Menu>
            <MenuTrigger disableButtonEnhancement>
                <MenuButton ref={ref}>Menu</MenuButton>
            </MenuTrigger>

            <MenuPopover>
                <MenuList>
                    {buttons.map((i, index) => {
                        return <OverflowMenuItem key={index} id={i.name} disabled={i.disabled} fn={i.fn} />;
                    })}
                </MenuList>
            </MenuPopover>
        </Menu>
    );
};
