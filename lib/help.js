function print() {
    console.log('Usage: ginit <command> [options]');
    console.log('');
    console.log('Options:');
    console.log('--help                             output usage information');
    console.log('');
    console.log('Commands:');
    console.log('init <name>                  create a new git repository');
}

module.exports = {
    print,
};
