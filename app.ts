import axios from 'axios';
import { range } from 'lodash';
import { from, lastValueFrom } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { BigNumber } from 'bignumber.js';
import { BlockInterface, Operation } from './dto';

class TezosBlock {
  private readonly number: number = 0;
  public data: BlockInterface | undefined;
  public operations: Array<Partial<Operation>> = [];

  constructor(number: number) {
    this.number = number;
  }

  async loadData(): Promise<void> {
    try {
      const response = await axios.get<BlockInterface>(`https://teznode.letzbake.com/chains/main/blocks/${this.number}`);
      if (!response.data) throw new Error('Unable to load data');
      this.data = response.data;
    } catch (errorOrException) {
      console.error(`loadData: ${errorOrException}`);
    }
  }

  async loadOperation(): Promise<void> {
    try {
      if (this.data && this.data.operations) {
        this.data.operations.forEach(block =>
          Array.isArray(block) && block.length > 0
            ? block.map(op => this.operations.push(op))
            : ''
        );
      }
    } catch (errorOrException) {
      console.error(`loadOperation: ${errorOrException}`);
    }
  }
}

/**
 * Reject IIFE
 * take normal named
 * arrow less function
 */
async function BakerMakerTaker() {
  const transactions: Partial<Operation>[] = [];
  const address: string = 'tz1TaLYBeGZD3yKVHQGBM857CcNnFFNceLYh';
  const bakerFees: Map<string, BigNumber> = new Map();
  console.time('BakerMakerTaker');

  try {
    const blockchains = range(832543, 832547);
    /**
     * This example is taken from my own answer from SO
     * https://stackoverflow.com/questions/67545459/rxjs-run-async-tasks-array-prototype-map-in-parallel-bulks-queue/67545783#67545783
     * Which allows us to receive concurrency of 2 promises, like a Promise.all | Promise.allSettled
     *
     * But for resource jobs we should take Message Brokers and Job Queue Modules
     */
    await lastValueFrom(
      from(blockchains).pipe(
        mergeMap(async (block) => {
          const Block = new TezosBlock(block);
          await Block.loadData();
          await Block.loadOperation();
          transactions.push(...Block.operations);
        }, 2),
      )
    )

    transactions.forEach(tx => {
      if (tx.contents) {
        tx.contents.map((row) => {
          if (!row.fee) return;
          /**
           * Technically. with JS map we could
           * group fees for each unique source, destination
           * or any other key
           */
          bakerFees.has(address)
            ? bakerFees.set(address, new BigNumber(bakerFees.get(address) as BigNumber).plus(row.fee))
            : bakerFees.set(address, new BigNumber(0))
        })
      }
    })

  } catch (e) {
    console.error(e);
  } finally {
    console.log('Count transactions', transactions.length);
    console.log(bakerFees);
    console.log('Bakers fees', (bakerFees.get(address) as BigNumber).toFixed());
    console.log('Memory (heapUsed, MB)', Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100);
    console.log('Time (seconds):');
    console.timeEnd('BakerMakerTaker');
  }
}

BakerMakerTaker();
