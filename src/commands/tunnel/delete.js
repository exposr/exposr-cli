import AccountService from '../../service/account-service.js';
import TunnelService from '../../service/tunnel-service.js';
import {
    ClientError,
    ERROR_NO_ACCOUNT,
    ERROR_NO_TUNNEL
} from '../../utils/errors.js';

export const command = 'delete <tunnel-id>';
export const desc = 'Delete an existing tunnel';
export const builder = function (yargs) {
    return yargs.positional('tunnel-id', {
        describe: 'Tunnel to delete',
        required: true,
    })
}
export const handler = async function (argv) {
    const cons = argv.cons;
    const {success, fail} = cons.logger.log(`Deleting tunnel ${argv['tunnel-id']}...`);

    await deleteTunnel({
        io: argv.io,
        server: argv['server'],
        account: argv['account'],
        tunnelId: argv['tunnel-id'],
    })
    .then(() => {
        success(`success`);
        cons.status.success(`Tunnel ${argv['tunnel-id']} deleted`);
    })
    .catch((e) => {
        fail(`failed (${e.message})`)
        cons.status.fail(`Failed to delete ${argv['tunnel-id']}`);
    });
}

export const deleteTunnel = async (args) => {
    const accountService = new AccountService(args);

    if (!accountService.account?.account_id) {
        throw new ClientError(ERROR_NO_ACCOUNT);
    }

    const tunnelService = new TunnelService(args);
    const tunnelId = tunnelService.tunnelId;
    if (!tunnelService.tunnelId) {
        throw new ClientError(ERROR_NO_TUNNEL);
    }

    return await tunnelService.delete(tunnelId);
}