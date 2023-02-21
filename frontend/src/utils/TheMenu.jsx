import { useNavigate } from 'react-router-dom';
import {
    Menu,
    MenuItem,
    MenuButton,
    SubMenu,
    MenuHeader,
    MenuDivider
} from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import Button from '@mui/material/Button';

export function TheMenu() {
    let navigate = useNavigate();

    return (
        <Menu menuButton={<Button sx={{ width: 100, padding: .25, mr: 3, mb: 2 }} variant="contained">Menu</Button>}>
            <SubMenu label="Customer">
                <MenuItem
                    value="Customer Admin"
                    onClick={(e) => {
                     console.log(`[MenuItem] ${e.value} clicked`);
                      e.stopPropagation = true;
                      e.keepOpen = false;
                      navigate("/customer");
                    }}
                >Customer Admin</MenuItem>
            </SubMenu>
            <SubMenu label="Vendor">
                <MenuItem>Vendor Maintenance</MenuItem>
            </SubMenu>
            <SubMenu label="Sales Order">
                <MenuItem>Sales Order Entry</MenuItem>
            </SubMenu>
            <MenuItem>Save</MenuItem>
            <MenuDivider />
            <MenuHeader>Special</MenuHeader>
            <MenuItem>Log Out</MenuItem>
        </Menu>
    );
}