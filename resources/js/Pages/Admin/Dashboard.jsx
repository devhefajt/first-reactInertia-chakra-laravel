import React from 'react';
import {  Box, Heading, Text, Container } from '@chakra-ui/react';
import AdminMasterLayout from '@/Layouts/AdminMasterLayout';
import { Head } from '@inertiajs/react';

const Dashboard = () => {

  return (
    <AdminMasterLayout>
      <Head title="Dashboard - Laravel+ReactInertia+Chakra"/>
        <Container maxW="container.xl">
            <Box bg="teal.500" p={5} borderRadius="md" boxShadow="md">
                <Heading color="white">Welcome to the Dashboard</Heading>
                <Text color="whiteAlpha.800" mt={2}>
                    This is your admin dashboard.
                </Text>
            </Box>
      </Container>
      </AdminMasterLayout>
    );
};

export default Dashboard;



