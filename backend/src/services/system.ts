import si from 'systeminformation';
import { prisma } from '../database/client';

export async function getServerMetrics() {
  const [cpu, mem, disk, net, os, processes, temp] = await Promise.all([
    si.currentLoad(),
    si.mem(),
    si.fsSize(),
    si.networkStats(),
    si.osInfo(),
    si.processes(),
    si.cpuTemperature(),
  ]);

  const cpuUsage = typeof cpu.currentLoad === 'number' && !isNaN(cpu.currentLoad) ? Math.round(cpu.currentLoad * 10) / 10 : 0;
  const ramUsage = mem.total > 0 ? Math.round((mem.active / mem.total) * 1000) / 10 : 0;

  // Find DebianServ mount point (/media/sabbil/DebianServ or fs matching sda8)
  const debianServDisk = disk.find(d => 
    d.mount === '/media/sabbil/DebianServ' || 
    d.fs === '/dev/sda8' || 
    d.mount.toLowerCase().includes('debianserv')
  ) || disk[0];

  const diskUsage = debianServDisk && debianServDisk.size > 0 
    ? Math.round((debianServDisk.used / debianServDisk.size) * 1000) / 10 
    : 0;
  const cpuTemp = temp.main && temp.main > 0 ? temp.main : undefined;

  const networkDown = (net.length > 0 && typeof net[0].rx_sec === 'number' && !isNaN(net[0].rx_sec) && net[0].rx_sec >= 0) ? net[0].rx_sec : 0;
  const networkUp = (net.length > 0 && typeof net[0].tx_sec === 'number' && !isNaN(net[0].tx_sec) && net[0].tx_sec >= 0) ? net[0].tx_sec : 0;
  const uptime = process.uptime();
  const processCount = processes.list ? processes.list.length : 0;

  return {
    cpuUsage,
    ramUsage,
    diskUsage,
    cpuTemp,
    networkDown,
    networkUp,
    uptime: Math.floor(uptime),
    processCount,
    recordedAt: new Date(),
  };
}

export async function saveServerMetrics() {
  const metrics = await getServerMetrics();
  return prisma.serverMetric.create({ data: metrics });
}

export async function getServerMetricsHistory(hours = 24) {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);
  return prisma.serverMetric.findMany({
    where: { recordedAt: { gte: since } },
    orderBy: { recordedAt: 'asc' },
    take: hours * 12, // 5-minute intervals
  });
}

export async function getLatestServerMetrics() {
  return prisma.serverMetric.findFirst({ orderBy: { recordedAt: 'desc' } });
}

export const systemService = {
  getServerMetrics,
  saveServerMetrics,
  getServerMetricsHistory,
  getLatestServerMetrics,
};