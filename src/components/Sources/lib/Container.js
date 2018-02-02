import Container from '../../Container';

export default {
    Component: Container,
    label: 'Container',
    notfield: 'true',
    extra: `import Container from '@/components/Container'`,
    props: {
        blocks: [8, 8, 8],
    },
}
