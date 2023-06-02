export const SERVICE_NAMES = {
    'http_client': 'Client',
    'us-central1-orchestrator-service.cloudfunctions.net': 'Orchestrator',
    'us-central1-identity-service-1fa8e.cloudfunctions.net': 'IdentityService',
    'us-central1-file-service-87ddd.cloudfunctions.net': 'FileService',
    'us-central1-file-links.cloudfunctions.net': 'FileLinkService',
};

export const getServiceName = (url) => {
    return SERVICE_NAMES[url] || url;
}
