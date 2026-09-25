import { Request, Response } from 'express';
import { asyncHandler } from '../middleware';
import * as networkService from '../services/network';

export const networkController = {
  dnsLookup: asyncHandler(async (req: Request, res: Response) => {
    const { domain } = req.body;
    const result = await networkService.dnsLookup(domain);
    res.json(result);
  }),

  whois: asyncHandler(async (req: Request, res: Response) => {
    const { domain } = req.body;
    const result = await networkService.whoisLookup(domain);
    res.json(result);
  }),

  ping: asyncHandler(async (req: Request, res: Response) => {
    const { host } = req.body;
    const result = await networkService.pingHost(host);
    res.json(result);
  }),

  checkPort: asyncHandler(async (req: Request, res: Response) => {
    const { host, port } = req.body;
    const portNum = parseInt(port, 10);
    const result = await networkService.checkPort(host, portNum);
    res.json(result);
  }),

  traceroute: asyncHandler(async (req: Request, res: Response) => {
    const { host } = req.body;
    const result = await networkService.tracerouteHost(host);
    res.json(result);
  }),

  httpHeaders: asyncHandler(async (req: Request, res: Response) => {
    const { url } = req.body;
    const result = await networkService.httpHeaders(url);
    res.json(result);
  }),

  publicIp: asyncHandler(async (req: Request, res: Response) => {
    const result = await networkService.publicIp();
    res.json(result);
  }),

  ipCalculator: asyncHandler(async (req: Request, res: Response) => {
    const { ip, cidr } = req.body;
    const result = networkService.calculateIpInfo(ip, cidr);
    res.json(result);
  }),

  subnetCalculator: asyncHandler(async (req: Request, res: Response) => {
    const { ip, cidr, subnets } = req.body;
    const result = networkService.calculateSubnets(ip, cidr, subnets);
    res.json(result);
  }),

  cidrConverter: asyncHandler(async (req: Request, res: Response) => {
    const { value, type } = req.body;
    const result = networkService.convertCidr(value, type);
    res.json(result);
  }),
};