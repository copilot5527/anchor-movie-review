import * as anchor from "@coral-xyz/anchor"
import { Program } from "@coral-xyz/anchor"
import { expect } from "chai"
import { AnchorMoviewReivewPorgram } from "../target/types/anchor_moview_reivew_porgram"

describe("anchor-movie-review-program", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  const program = anchor.workspace
    .AnchorMoviewReivewPorgram as Program<AnchorMoviewReivewPorgram>

  const movie = {
    title: "Just a test movie",
    description: "Wow what a good movie it was real great",
    rating: 5,
  }

  const [moviePda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(movie.title), provider.wallet.publicKey.toBuffer()],
    program.programId
  )

  it("Movie review is added`", async () => {
    // Add your test here.
    const tx = await program.methods
      .addMovieReview(movie.title, movie.description, movie.rating)
      .rpc()
  
    const account = await program.account.movieAccountState.fetch(moviePda)
    expect(account.title).to.equal(movie.title)
    expect(account.rating).to.equal(movie.rating)
    expect(account.description).to.equal(movie.description)
    expect(account.reviewer.toBase58()).to.equal(provider.wallet.publicKey.toBase58())
  })

  it("Movie review is updated`", async () => {
    const newDescription = "Wow this is new"
  const newRating = 4

  const tx = await program.methods
    .updateMovieReview(movie.title, newDescription, newRating)
    .rpc()

    const account = await program.account.movieAccountState.fetch(moviePda)
    expect(account.title).to.equal(movie.title)
    expect(account.rating).to.equal(newRating)
    expect(account.description).to.equal(newDescription)
    expect(account.reviewer.toBase58()).to.equal(provider.wallet.publicKey.toBase58())
  })

  it("Deletes a movie review", async () => {
    const tx = await program.methods
      .deleteMovieReview(movie.title)
      .rpc()
  })
})