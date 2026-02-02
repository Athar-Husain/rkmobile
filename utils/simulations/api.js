export const fetchCities = () => 
    Promise.resolve([
        {
            id: '1',
            name: 'New York',
            areas: [
                { id: '1', name: 'Manhattan' },
                { id: '2', name: 'Brooklyn' },
            ],
        },
        {
            id: '2',
            name: 'Los Angeles',
            areas: [
                { id: '3', name: 'Hollywood' },
                { id: '4', name: 'Beverly Hills' },
            ],
        },
    ])
