import React from 'react';
import { Box, VStack,  Text } from '@chakra-ui/react';
import { Link } from '@inertiajs/react'


const SidebarLayout = () => {
    return (
        <Box bg="blue.700" color="white" w="250px" p="4" minH="100vh">
            <Text fontSize="xl" fontWeight="bold" mb="4">
                Menu
            </Text>
            <VStack align="start" spacing="3">
                <Link href="/dashboard" _hover={{ color: 'gray.200' }}>
                    Dashboard
                </Link>
                <Link href="/users" _hover={{ color: 'Red.200' }}>
                    Users
                </Link>
                <Link href="/settings" _hover={{ color: 'gray.200' }}>
                    Settings
                </Link>
                <Link href="/configs" _hover={{ color: 'gray.200' }}>
                    Config
                </Link>
            </VStack>
        </Box>
    );
};

export default SidebarLayout;
