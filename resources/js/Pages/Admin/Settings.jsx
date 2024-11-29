import React from "react";
import { Heading } from "@chakra-ui/react";
import AdminMasterLayout from "@/Layouts/AdminMasterLayout";
import { Head } from '@inertiajs/react';

const Settings = () => {
    return (
        <AdminMasterLayout>
            <Head title="Settings - Laravel+ReactJS+Chakra" />
            
            <Heading size="lg">Settings</Heading>
        </AdminMasterLayout>
    );
};

export default Settings;
