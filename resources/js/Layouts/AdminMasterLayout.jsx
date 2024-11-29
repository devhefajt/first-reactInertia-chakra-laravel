import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import HeaderLayout from './HeaderLayout';
import SidebarLayout from './SidebarLayout';
import FooterLayout from './FooterLayout';

const AdminMasterLayout = ({ children }) => {
    return (
        <Flex direction="column" minH="100vh">
            {/* Header */}
            <HeaderLayout />

            <Flex flex="1">
                {/* Sidebar */}
                <SidebarLayout />

                {/* Main Content */}
                <Box flex="1" p="6" bg="gray.100">
                    {children}
                </Box>
            </Flex>

            {/* Footer */}
            <FooterLayout />
        </Flex>
    );
};

export default AdminMasterLayout;
